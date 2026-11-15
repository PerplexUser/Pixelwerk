const {test}=require('node:test');
const assert=require('node:assert/strict');
const {createAdapter}=require('../../src/renderer/agent-adapter.js');
function make(host){let current='brush';return createAdapter({tr:s=>s,toolIds:['move','select','crop','brush','airbrush','smudge','marker','line','arrow','shape','eraser','fill','picker','text','background','smile'],getState:()=>({loaded:false,width:null,height:null,tool:current,layers:[]}),selectTool:t=>{current=t;},setPosition:(x,y)=>({id:'1',x,y}),resize:(width,height)=>({width,height,layers:1})},host);}
test('adapter works without a host and exposes exactly four metadata-only contracts',()=>{
  const a=make();assert.equal(a.list().length,4);assert.equal(a.list()[0].annotations.readOnlyHint,true);assert.equal(a.list()[0].annotations.untrustedContentHint,true);
  assert.deepEqual(a.invoke('select_editor_tool',{tool:'smile'}),{tool:'smile'});assert.equal(a.invoke('get_editor_state',{}).tool,'smile');
  for(const [name,args] of [['get_editor_state',{extra:1}],['get_editor_state',[]],['select_editor_tool',{tool:'bad'}],['set_active_layer_position',{x:Infinity,y:0}],['set_active_layer_position',{x:16385,y:0}],['resize_image',{width:8192,height:2442}],['resize_image',{width:1.2,height:1}],['resize_image',{width:1,height:1,extra:true}]])assert.throws(()=>a.invoke(name,args));
  assert.throws(()=>a.invoke('unknown',{}));
});
test('mock host receives original schemas and abort lifecycle stops calls',()=>{
  const definitions=[];const a=make({registerTool:(tool,options)=>definitions.push({tool,options})});
  assert.equal(definitions.length,4);assert.equal(definitions[1].tool.inputSchema.properties.tool.enum.length,16);
  assert.deepEqual(definitions[3].tool.execute({width:600,height:400}),{width:600,height:400,layers:1});
  a.dispose();assert.equal(definitions.every(x=>x.options.signal.aborted),true);assert.throws(()=>a.invoke('get_editor_state',{}),/ADAPTER_DISPOSED/);
});
test('unavailable or throwing host registration does not stop the editor',async()=>{
  const a=make({registerTool:()=>{throw new Error('host absent');}});assert.equal(a.invoke('get_editor_state',{}).loaded,false);
  const b=make({registerTool:()=>Promise.reject(new Error('host absent'))});await new Promise(r=>setImmediate(r));assert.equal(b.list().length,4);
});
