(function(root){
  'use strict';
  function createAdapter(editor, host = null) {
    const { tr } = editor, lifecycle = new AbortController();
    const exact = (input, keys) => input !== null && typeof input === 'object' && !Array.isArray(input) &&
      Object.keys(input).length === keys.length && keys.every(key => Object.hasOwn(input,key));
    const tool = (name, title, description, properties, required, readOnlyHint, execute) => ({
      name, title: tr(title), description: tr(description),
      inputSchema: { type:'object', properties, ...(required.length ? {required} : {}), additionalProperties:false },
      annotations: { readOnlyHint, untrustedContentHint:readOnlyHint },
      execute(input) {
        if (lifecycle.signal.aborted) throw new Error('ADAPTER_DISPOSED');
        return execute(input);
      }
    });
    const tools = [
      tool('get_editor_state','Bildzustand lesen','Liest Maße, Werkzeuge und Ebenen des lokal geöffneten Bildes. Liefert keine Bilddaten.',{},[],true,input=>{
        if(!exact(input,[]))throw new Error(tr('Ungültige Eingabe.'));
        return editor.getState();
      }),
      tool('select_editor_tool','Bildwerkzeug wählen','Wählt ein Werkzeug im lokalen Bildeditor. Verändert keine Bildpixel.',{tool:{type:'string',enum:[...editor.toolIds]}},['tool'],false,input=>{
        if(!exact(input,['tool'])||!editor.toolIds.includes(input.tool))throw new Error(tr('Ungültiges Werkzeug.'));
        editor.selectTool(input.tool);return{tool:input.tool};
      }),
      tool('set_active_layer_position','Ebene positionieren','Verschiebt die aktuell ausgewählte Ebene auf absolute Pixelkoordinaten. Rückgängig ist verfügbar.',{x:{type:'number',minimum:-16384,maximum:16384},y:{type:'number',minimum:-16384,maximum:16384}},['x','y'],false,input=>{
        if(!exact(input,['x','y'])||![input.x,input.y].every(n=>Number.isFinite(n)&&Math.abs(n)<=16384))throw new Error(tr('Ungültige Position.'));
        return editor.setPosition(input.x,input.y);
      }),
      tool('resize_image','Bildgröße ändern','Bildgröße auf absolute Pixelmaße ändern. Skaliert alle Ebenen und erhält ihre Bearbeitbarkeit. Rückgängig ist verfügbar.',{width:{type:'integer',minimum:1,maximum:8192},height:{type:'integer',minimum:1,maximum:8192}},['width','height'],false,input=>{
        if(!exact(input,['width','height'])||![input.width,input.height].every(n=>Number.isInteger(n)&&n>=1))throw new Error(tr('Bitte gib positive ganze Pixelwerte ein.'));
        if(input.width>8192||input.height>8192||input.width*input.height>20000000)throw new Error(tr('Bitte wähle höchstens 8.192 Pixel pro Seite und insgesamt 20 Megapixel.'));
        return editor.resize(input.width,input.height);
      })
    ];
    if (host && typeof host.registerTool === 'function') for (const definition of tools) {
      try { Promise.resolve(host.registerTool(definition,{signal:lifecycle.signal})).catch(()=>{}); } catch {}
    }
    return Object.freeze({
      list: () => tools.map(({execute,...metadata})=>structuredClone(metadata)),
      invoke(name,input) { const definition=tools.find(t=>t.name===name);if(!definition)throw new Error('UNKNOWN_TOOL');return definition.execute(input); },
      dispose: () => lifecycle.abort()
    });
  }
  const api = {createAdapter};
  if(typeof module!=='undefined')module.exports=api;else root.PixelAgentAdapter=Object.freeze(api);
})(globalThis);
