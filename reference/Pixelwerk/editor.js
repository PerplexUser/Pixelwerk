(function(){
'use strict';
const {tr,html,htmlText}=PixelI18n;
const C=PixelCore,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paths={crop:'M6 3v15h15M3 6h15v15',image:'M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z M3 16l6-6 5 5 3-3 4 4 M15 7h.01',open:'M3 7v13h17l2-11H8l-2-2H3Z M3 7V4h6l3 3h7v2',download:'M12 3v12m-5-5 5 5 5-5M4 15v6h16v-6',undo:'M9 4 4 9l5 5M4 9h10a6 6 0 0 1 0 12',redo:'M15 4l5 5-5 5M20 9H10a6 6 0 0 0 0 12',move:'M12 2v20M2 12h20M8 6l4-4 4 4M8 18l4 4 4-4M6 8l-4 4 4 4M18 8l4 4-4 4',select:'M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5M3 11v2M21 11v2M11 3h2M11 21h2',brush:'M14 4l6 6M9 15 20 4a2 2 0 0 0-3-3L6 12M9 15c0 6-6 6-7 6 2-2 0-6 4-7 1-1 2 0 3 1Z',eraser:'m3 13 10-10a2 2 0 0 1 3 0l5 5a2 2 0 0 1 0 3L11 21H7l-4-4a3 3 0 0 1 0-4Z M8 8l9 9M10 21h12',fill:'m8 3 10 10-7 7a2 2 0 0 1-3 0l-6-6a2 2 0 0 1 0-3l7-7M3 12h14M6 2l4 4M20 14s-3 4-3 5a3 3 0 0 0 6 0c0-1-3-5-3-5Z',picker:'m14 4 6 6M6 15l9-9 3 3-9 9H6v-3ZM6 18l-3 3M14 4l2-2 6 6-2 2',text:'M4 5V3h16v2M12 3v18M8 21h8',background:'m3 20 8-8M8 3v4M6 5h4M17 11v6M14 14h6M17 2v4M15 4h4M3 11v3M1.5 12.5h3',smile:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM7 8h.01M17 8h.01M7 14s1 4 5 4 5-4 5-4',plus:'M12 5v14M5 12h14',minus:'M5 12h14',fit:'M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5',lock:'M6 10h12v11H6V10ZM8 10V6a4 4 0 0 1 8 0v4M12 14v3',layers:'m12 3 10 6-10 6L2 9l10-6ZM2 14l10 6 10-6M2 18l10 6 10-6',eye:'M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12ZM15 12a3 3 0 1 0-6 0 3 3 0 0 0 6 0Z',eyeoff:'M3 3l18 18M9 5c8-2 14 7 14 7s-1 3-5 5M6 6C3 8 1 12 1 12s5 9 13 6M10 10l4 4',trash:'M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7',up:'m6 14 6-6 6 6',down:'m6 10 6 6 6-6',copy:'M8 8h13v13H8V8ZM16 8V3H3v13h5',check:'m5 12 4 4L19 6',close:'m6 6 12 12M6 18 18 6',settings:'M4 6h16M4 12h16M4 18h16M8 3v6M16 9v6M10 15v6',help:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM9 8a3 3 0 0 1 6 0c0 3-3 2-3 5M12 17h.01',clipboard:'M8 4H5v17h14V4h-3M8 2h8v5H8V2ZM8 11h8M8 15h6',chevron:'m8 10 4 4 4-4'};
Object.assign(paths,{airbrush:'M5 9h8v12H5V9ZM6 9V6h6v3M8 6V3h4v3M15 4h.01M19 2h.01M20 6h.01M16 8h.01M5 16h8',line:'M5 19 19 5M3 17h4v4H3v-4ZM17 3h4v4h-4V3'});
Object.assign(paths,{smudge:'M8 12V5a2 2 0 0 1 4 0v7M12 8l3 1 3 2v6l-3 5H8l-5-8a2 2 0 0 1 3-2l2 2M18 5h4M20 3v4',marker:'m4 15 9-11 7 6-9 10H6l-2-5ZM4 15l7 5M3 22h8M8 11l7 6',arrow:'M3 21 16 8M10 4h10v10L10 4Z',shape:'M3 3h18v18H3V3Z',ellipse:'M22 12a10 7 0 1 1-20 0 10 7 0 1 1 20 0Z'});
const icon=n=>html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[n]||paths.image}"/></svg>`;
const toolDefs=[['move','Verschieben','V'],['select','Auswahl','M'],['crop','Zuschneiden','C'],['brush','Pinsel','B'],['airbrush','Sprühdose','A'],['smudge','Schmierfinger','D'],['marker','Textmarker','H'],['line','Linie','L'],['arrow','Pfeil','P'],['shape','Formen','U'],['eraser','Radierer','E'],['fill','Fülleimer','G'],['picker','Pipette','I'],['text','Text','T'],['background','Hintergrundradierer','R'],['smile','Sticker','S']];
const S={width:1200,height:800,name:tr('Unbenannt'),nameKey:'Unbenannt',textEdited:false,loaded:false,tool:'brush',tab:'tool',layers:[],active:null,color:'#148A75',brush:{size:32,opacity:100,density:65,hardness:85,thickness:100,shape:'round'},airbrush:{size:80,opacity:60,density:35},line:{width:6,opacity:100},lineStart:null,smudge:{size:40,strength:55,hardness:35},marker:{size:28,opacity:45,color:'#FFFF00',dark:false},arrow:{width:6,opacity:100,color:'#FF0000'},shape:{width:6,opacity:100,color:'#FF0000',kind:'rect',locked:false},pickerTarget:null,eraser:{size:32,opacity:100,density:100,hardness:100,thickness:100},fill:{tolerance:20,contiguous:true},bg:{tolerance:20,contiguous:true},text:{value:tr('Dein Text'),size:72,font:'Arial',color:'#148A75',stroke:'#FFFFFF',strokeWidth:0,weight:'700'},zoom:1,fit:true,selection:null,crop:null,gesture:null,cursor:null,history:[],historyIndex:-1,clipboard:null,clipboardLocalOnly:false,fx:{contrast:0,brightness:0,saturation:0,effect:'none'},previewCanvas:null,changed:false,restoreBusy:false};
let uid=0,renderFrame=0,toastTimer,fxFrame=0,editTimer=0,sprayFrame=0;const nextId=()=>`layer-${++uid}`;
$('#app').innerHTML=`
<header class="topbar"><div class="brand"><div class="brandmark">${icon('crop')}</div>Pixelwerk<span>© by www.perplex.click</span></div><div class="docname" id="docname">Dein kreativer Freiraum</div><div class="header-right"><div class="language-switch" role="group" aria-label="Sprache / Language"><button data-language="de" title="Deutsch" aria-pressed="true">DE</button><button data-language="en" title="English" aria-pressed="false">EN</button></div><span class="private">${icon('lock')}Bleibt auf deinem Gerät</span><button class="btn" data-action="open">${icon('open')}<span class="open-label">Bild öffnen</span></button><button class="btn primary" data-action="export" id="export-btn" disabled>${icon('download')}Exportieren</button></div></header>
<main class="workbench"><nav class="toolrail" aria-label="Bildwerkzeuge">${toolDefs.map(([id,name,key],i)=>`${['brush','marker','text'].includes(id)?htmlText('<div class="rail-sep"></div>'):''}<button class="tool ${id==='brush'?'active':''}" data-tool="${id}" aria-label="${name} (${key})" title="${name} (${key})" aria-pressed="${id==='brush'}">${icon(id)}</button>`).join('')}<div class="spacer"></div><div class="rail-color" title="Vordergrundfarbe"><input type="color" id="rail-color" value="${S.color}" aria-label="Vordergrundfarbe"></div><button class="tool" data-action="help" aria-label="Hilfe und Tastenkürzel" title="Hilfe und Tastenkürzel">${icon('help')}</button></nav>
<section class="workspace" aria-label="Arbeitsfläche"><div class="workspace-top"><div class="workspace-title">${icon('layers')}ARBEITSFLÄCHE</div><div class="history-controls"><button class="btn small resize-trigger" data-action="resize-image" id="image-size-btn" title="Bildgröße ändern" aria-label="Bildgröße ändern" disabled>${icon('fit')}<span class="resize-label">Bildgröße</span></button><span class="subtle history-count" id="history-label">Alles beginnt mit einem Bild</span><span class="divider"></span><button class="icon-btn" data-action="undo" title="Rückgängig (Strg+Z)" aria-label="Rückgängig" id="undo-btn" disabled>${icon('undo')}</button><button class="icon-btn" data-action="redo" title="Wiederholen (Strg+Umschalt+Z)" aria-label="Wiederholen" id="redo-btn" disabled>${icon('redo')}</button><button class="icon-btn" data-action="new" title="Neue Leinwand" aria-label="Neue Leinwand">${icon('plus')}</button><button class="icon-btn mobile-panel-toggle" data-action="toggle-panel" title="Einstellungen" aria-label="Einstellungen öffnen" aria-expanded="false">${icon('settings')}</button></div></div>
<div class="canvas-area" id="canvas-area"><div class="canvas-scroll" id="canvas-scroll"><div class="empty" id="empty"><div class="eyebrow">PLATZ FÜR DEINE IDEEN</div><div class="empty-icon">${icon('image')}</div><h1>Mach dein Bild zu deinem.</h1><p>Zieh ein Bild hierher oder öffne es von deinem Gerät. Den Rest machst du hier.</p><div class="empty-actions"><button class="btn accent" data-action="open">${icon('plus')}Bild öffnen</button><button class="btn" data-action="new">Neue Leinwand</button></div><div class="paste-hint">Oder direkt einfügen <kbd>Strg</kbd> + <kbd>V</kbd></div><div class="formats"><span class="format-tag">JPG</span><span class="format-tag">PNG</span><span class="format-tag">BMP</span></div></div><div class="canvas-stack" id="canvas-stack" hidden><canvas id="image-canvas" aria-label="Bildvorschau"></canvas><canvas id="overlay" tabindex="0" aria-label="Leinwand. Bearbeitung mit dem gewählten Werkzeug; Tastenkürzel über Hilfe." role="img"></canvas></div></div></div>
<div id="canvas-actions"></div><footer class="statusbar"><span id="dimensions">Noch kein Bild geöffnet</span><span class="status-hint" id="status-hint"></span><div class="zoom"><button class="icon-btn" data-action="zoom-out" title="Verkleinern" aria-label="Verkleinern">${icon('minus')}</button><button class="zoom-label" data-action="zoom-100" title="Originalgröße" id="zoom-label">100 %</button><button class="icon-btn" data-action="zoom-in" title="Vergrößern" aria-label="Vergrößern">${icon('plus')}</button><span class="divider"></span><button class="icon-btn" data-action="fit" title="An Arbeitsfläche anpassen" aria-label="An Arbeitsfläche anpassen">${icon('fit')}</button></div></footer></section>
<aside class="inspector" id="inspector" aria-label="Eigenschaften"><div class="panel-tabs" role="tablist"><button class="panel-tab active" role="tab" aria-selected="true" data-tab="tool">Werkzeug</button><button class="panel-tab" role="tab" aria-selected="false" data-tab="layers">Ebenen <span id="layer-count"></span></button><button class="panel-tab" role="tab" aria-selected="false" data-tab="effects">Effekte</button></div><div id="panel" role="tabpanel"></div></aside></main>
<input type="file" accept="image/png,image/jpeg,image/bmp,.bmp,.jpg,.jpeg,.png" id="file-open" hidden><input type="file" accept="image/png,image/jpeg,image/bmp,.bmp,.jpg,.jpeg,.png" id="file-layer" hidden multiple><div id="toast" class="toast" role="status" aria-live="polite" hidden></div><dialog id="dialog"></dialog>`;
const localizeShell=PixelI18n.bindShell($('#app'));
const mainCanvas=$('#image-canvas'),overlay=$('#overlay'),ctx=mainCanvas.getContext('2d'),ov=overlay.getContext('2d');
function toast(message,error=false){message=tr(message);const e=$('#toast');e.textContent=message;e.classList.toggle('error',error);e.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.hidden=true,4500);}
function active(){return S.layers.find(l=>l.id===S.active);}
function bounds(){const l=active();return l?{x:l.x,y:l.y,w:l.w,h:l.h}:null;}
function paintSettings(){return ['eraser','airbrush','smudge','marker'].includes(S.tool)?S[S.tool]:S.brush;}
function colorTarget(){return ['marker','arrow','shape'].includes(S.tool)?S.tool:S.tool==='picker'?S.pickerTarget:null;}
function toolColor(){return colorTarget()?S[colorTarget()].color:S.color;}
function hasDoc(){if(S.loaded)return true;toast(tr('Öffne ein Bild oder erstelle eine neue Leinwand.'));return false;}
function section(title,content,key=''){return html`<section class="panel-section"><div class="section-head"><h2>${tr(title)}</h2>${key?html`<span class="badge">${key}</span>`:''}</div>${content}</section>`;}
function slider(label,id,value,min=0,max=100,unit='%',step=1){return html`<div class="field"><label class="field-head" for="${id}"><span>${tr(label)}</span><output id="${id}-out">${value} ${unit}</output></label><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${value}" style="--pct:${(value-min)/(max-min)*100}%"></div>`;}
function numberField(label,id,value,min=0,max=8192){return html`<div class="field"><label class="field-head" for="${id}">${tr(label)}</label><input type="number" id="${id}" min="${min}" max="${max}" value="${Math.round(value)}"></div>`;}
function toolTip(head,body){return html`<div class="tips"><strong>${tr(head)}</strong>${body}</div>`;}
function colorPanel(){
  const marker=colorTarget()==='marker',value=toolColor(),neons=[['#FFFF00','Neongelb'],['#39FF14','Neongrün'],['#FF38B8','Neonpink'],['#FF9000','Neonorange'],['#00E5FF','Neonblau'],['#BF5FFF','Neonviolett']];
  const colors=marker?neons:[['#FF0000',''],['#26352D',''],['#FFFFFF',''],['#148A75',''],['#FFFF00',''],['#00E5FF',''],['#578EE2',''],['#7B69C2',''],['#C881AD',''],['#E5B761',''],['#D98462',''],['#C65258',''],['#EEA589',''],['#C7DDBA',''],['#AAE2DB',''],['#AECBF1','']];
  return section('Farbe',html`<div class="color-current"><span class="color-swatch"><input type="color" id="main-color" value="${value}" aria-label="Farbe wählen"></span><input type="text" id="hex-color" class="hex-value" value="${value.toUpperCase()}" aria-label="Hex-Farbcode" maxlength="7"><button class="icon-btn" data-tool="picker" aria-label="Pipette" title="Farbe aus dem Bild wählen">${icon('picker')}</button></div><div class="swatches ${marker?'neon-swatches':''}">${colors.map(([color,name])=>html`<button class="swatch" style="background:${color}" data-color="${color}" aria-label="${name?tr(name):tr('Farbe')+' '+color}" title="${name?tr(name):color}"></button>`).join('')}</div>`);
}
function brushShapePicker(){
  return html`<div class="field"><span class="field-head">Pinselspitze</span><div class="tip-options" role="group" aria-label="Pinselspitze">${[['round','Rund'],['square','Quadratisch']].map(([shape,label])=>html`<button class="tip-option ${S.brush.shape===shape?'active':''}" data-tip-shape="${shape}" aria-pressed="${S.brush.shape===shape}"><span class="tip-symbol ${shape}" aria-hidden="true"></span>${tr(label)}</button>`).join('')}</div></div>`;
}
function eraserTarget(retouch=false){
  const layer=active();
  return html`<div class="eraser-target"><label class="field-head" for="eraser-layer">${retouch?tr('Ebene zum Verschmieren'):tr('Ebene zum Radieren')}</label>
    <select id="eraser-layer" class="input" ${S.layers.length?'':'disabled'}>${S.layers.length?S.layers.slice().reverse().map(item=>html`<option value="${item.id}" ${item.id===S.active?'selected':''}>${esc(layerName(item))}</option>`).join(''):html`<option>Keine Ebene ausgewählt.</option>`}</select>
    <p class="helper">${retouch?tr('Vorhandene Farben dieser Ebene verschmieren. Text und Sticker werden dabei in Pixel umgewandelt; Rückgängig stellt sie wieder her.'):layer?.type==='text'?tr('Text und Sticker werden beim Radieren in Pixel umgewandelt. Mit Rückgängig kannst du sie wieder als Text bearbeiten.'):tr('Nur diese Ebene wird radiert. Darunterliegende Ebenen bleiben sichtbar; das Schachbrett steht für Transparenz.')}</p>
    ${S.selection?html`<p class="helper">${retouch?tr('Eine Auswahl begrenzt den Schmierfinger.'):tr('Eine Auswahl begrenzt den Radierer.')}</p><button class="btn small full" data-action="clear-selection">Auswahl aufheben</button>`:''}
  </div>`;
}

function renderPanel(){
  const l=active();let panelHTML='';
  $$('.panel-tab').forEach(e=>{e.classList.toggle('active',e.dataset.tab===S.tab);e.setAttribute('aria-selected',String(e.dataset.tab===S.tab));});
  if(S.tab==='layers'){
    panelHTML=section(tr('Deine Ebenen'),html`<button class="btn full" data-action="add-image">${icon('plus')}Bild hinzufügen</button><div id="layer-list">${S.layers.slice().reverse().map(l=>html`<div class="layer ${l.id===S.active?'active':''}" data-layer="${l.id}" tabindex="0" role="button" aria-label="${esc(tr('Ebene {name} auswählen',{name:layerName(l)}))}" aria-pressed="${l.id===S.active}"><canvas class="layer-thumb" width="76" height="68" data-thumb="${l.id}"></canvas><span class="layer-name">${esc(layerName(l))}<small>${l.type==='text'?tr('Text'):tr('Bildebene')}</small></span><button class="icon-btn" data-visibility="${l.id}" aria-label="${l.visible?tr('Ebene ausblenden'):tr('Ebene einblenden')}" title="${l.visible?tr('Ausblenden'):tr('Einblenden')}">${icon(l.visible?'eye':'eyeoff')}</button></div>`).join('')||htmlText('<p class="helper">Dein Bild und eingefügte Elemente erscheinen hier.</p>')}</div><div class="layer-actions"><button class="icon-btn" data-action="add-layer" title="Leere Ebene" aria-label="Leere Ebene">${icon('plus')}</button><button class="icon-btn" data-action="layer-up" title="Eine Ebene nach vorn" aria-label="Ebene nach vorn">${icon('up')}</button><button class="icon-btn" data-action="layer-down" title="Eine Ebene nach hinten" aria-label="Ebene nach hinten">${icon('down')}</button><button class="icon-btn" data-action="duplicate" title="Ebene duplizieren" aria-label="Ebene duplizieren">${icon('copy')}</button><button class="icon-btn" data-action="delete-layer" title="Ebene löschen" aria-label="Ebene löschen">${icon('trash')}</button></div>${l?slider(tr('Deckkraft'),'layer-opacity',l.opacity*100):''}`);
    if(l)panelHTML+=section(tr('Position & Größe'),transformFields(l));
    panelHTML+=toolTip(tr('Alles an seinem Platz'),tr('Wähle eine Ebene und verschiebe sie auf der Leinwand. Ziehe an den Ecken, um ihre Größe zu ändern.'));
  }else if(S.tab==='effects'){
    panelHTML=section(tr('Licht & Farbe'),html`${slider(tr('Kontrast'),'fx-contrast',S.fx.contrast,-100,100)}${slider(tr('Helligkeit'),'fx-brightness',S.fx.brightness,-100,100)}${slider(tr('Sättigung'),'fx-saturation',S.fx.saturation,-100,100)}`);
    const fx=[['none',tr('Original'),'none'],['mono',tr('Schwarzweiß'),'grayscale(1)'],['sepia',tr('Sepia'),'sepia(.85)'],['warm',tr('Warm'),'sepia(.4) saturate(1.4)'],['cool',tr('Kühl'),'hue-rotate(25deg)'],['invert',tr('Negativ'),'invert(1)']];
    panelHTML+=section(tr('Ein anderer Blick'),html`<div class="effect-grid">${fx.map(([id,name,filter])=>html`<button class="effect-btn ${S.fx.effect===id?'active':''}" data-effect="${id}" aria-pressed="${S.fx.effect===id}"><div class="effect-preview" style="filter:${filter}"></div>${name}</button>`).join('')}</div><p class="helper">Vorschau für die ausgewählte Ebene${S.selection?tr(' innerhalb der Auswahl'):''}.</p><div class="row" style="margin-top:18px"><button class="btn" data-action="reset-effects">Zurücksetzen</button><button class="btn accent" data-action="apply-effects">Anwenden</button></div>`);
  }else{
    switch(S.tool){
      case 'brush':case 'eraser':panelHTML=section(S.tool==='brush'?tr('Pinsel'):tr('Radierer'),html`${S.tool==='eraser'?eraserTarget():brushShapePicker()}${slider(tr('Größe'),'brush-size',paintSettings().size,1,300,'px')}${slider(tr('Deckkraft'),'brush-opacity',paintSettings().opacity,1,100)}${slider(tr('Dichte'),'brush-density',paintSettings().density,1,100)}${slider(tr('Härte'),'brush-hardness',paintSettings().hardness,0,100)}${slider(tr('Dicke'),'brush-thickness',paintSettings().thickness,5,100)}<div class="brush-preview ${S.tool==='eraser'?'eraser-preview':''}"><canvas id="brush-preview" width="420" height="128" aria-label="Vorschau des Pinselstrichs"></canvas></div>`,S.tool==='brush'?'B':'E');if(S.tool==='brush')panelHTML+=colorPanel();panelHTML+=toolTip(tr('Ein Strich, viele Möglichkeiten'),html`Mit <kbd>[</kbd> und <kbd>]</kbd> änderst du die Pinselgröße. ${S.tool==='eraser'?tr('Der Radierer erzeugt Transparenz auf der ausgewählten Ebene.'):tr('Dichte steuert den Farbauftrag, Dicke die Form der Pinselspitze.')}`);break;
      case 'airbrush':panelHTML=section('Sprühdose',html`${slider('Sprühbereich','airbrush-size',S.airbrush.size,1,300,'px')}${slider('Deckkraft','airbrush-opacity',S.airbrush.opacity,1,100)}${slider('Dichte','airbrush-density',S.airbrush.density,1,100)}<div class="brush-preview"><canvas id="airbrush-preview" width="420" height="128" aria-label="Vorschau der Sprühdose"></canvas></div>`,'A')+colorPanel()+toolTip('Farbe aus der Sprühdose',tr('Halte die Maustaste gedrückt, um zu sprühen. Auch ohne Bewegung wird der Farbauftrag dichter. Größe, Deckkraft und Dichte sind unabhängig vom Pinsel.'));break;
      case 'line':panelHTML=section('Linie',html`${slider('Linienbreite','line-width',S.line.width,1,200,'px')}${slider('Deckkraft','line-opacity',S.line.opacity,1,100)}<p class="helper line-step" role="status">${S.lineStart?tr('Endpunkt wählen'):tr('Startpunkt wählen')}</p><button class="btn full" data-action="cancel-line" ${S.lineStart?'':'disabled'}>Linie abbrechen</button>`,'L')+colorPanel()+toolTip('Zwei Klicks, eine Linie',tr('Klicke zuerst auf den Startpunkt und dann auf den Endpunkt. Die Vorschau folgt der Maus. Esc bricht die begonnene Linie ab. Eine Auswahl begrenzt die gezeichnete Linie.'));break;
      case 'smudge':panelHTML=section('Schmierfinger',html`${eraserTarget(true)}${slider('Größe','smudge-size',S.smudge.size,1,300,'px')}${slider('Stärke','smudge-strength',S.smudge.strength,1,100)}${slider('Härte','smudge-hardness',S.smudge.hardness,0,100)}`,'D')+toolTip('Farben weich ineinanderziehen',tr('Setze auf einer vorhandenen Farbe an und ziehe sie in den benachbarten Bereich. Geringe Stärke eignet sich für sanfte Retuschen. Die gewählte Malfarbe wird nicht verwendet.'));break;
      case 'marker':panelHTML=section('Textmarker',html`${slider('Größe','marker-size',S.marker.size,2,160,'px')}${slider('Deckkraft','marker-opacity',S.marker.opacity,1,100)}<label class="checkbox"><input id="marker-dark" type="checkbox" ${S.marker.dark?'checked':''}>Dunkler Hintergrund</label>`,'H')+colorPanel()+toolTip('Text lesbar markieren',tr('Ziehe über den Text. Mit Umschalt bleibt die Markierung gerade. Jede Markierung liegt auf einer eigenen Ebene. Aktiviere bei dunklen Screenshots „Dunkler Hintergrund“.'));break;
      case 'arrow':panelHTML=section('Pfeil',html`${slider('Linienbreite','arrow-width',S.arrow.width,1,100,'px')}${slider('Deckkraft','arrow-opacity',S.arrow.opacity,1,100)}`,'P')+colorPanel()+toolTip('Auf den Punkt zeigen',tr('Ziehe vom Pfeilanfang zur Pfeilspitze. Umschalt richtet den Pfeil in 45°-Schritten aus. Esc bricht ab. Nach dem Zeichnen kannst du die neue Ebene verschieben.'));break;
      case 'shape':panelHTML=section('Formen',html`<div class="tip-options" role="group" aria-label="Form wählen">${[['rect','Rechteck','shape'],['ellipse','Oval','ellipse']].map(([kind,label,symbol])=>html`<button class="tip-option ${S.shape.kind===kind?'active':''}" data-form="${kind}" aria-pressed="${S.shape.kind===kind}">${icon(symbol)}${tr(label)}</button>`).join('')}</div><label class="checkbox"><input id="shape-locked" type="checkbox" ${S.shape.locked?'checked':''}>Kreis / Quadrat</label>${slider('Konturbreite','shape-width',S.shape.width,1,100,'px')}${slider('Deckkraft','shape-opacity',S.shape.opacity,1,100)}`,'U')+colorPanel()+toolTip('Bereiche hervorheben',tr('Ziehe die Form auf dem Bild auf. „Kreis / Quadrat“ oder Umschalt hält beide Seiten gleich lang. Die Kontur bleibt innen transparent. Esc bricht ab.'));break;
      case 'fill':panelHTML=section(tr('Fülleimer'),html`${slider(tr('Toleranz'),'fill-tolerance',S.fill.tolerance)}${slider(tr('Deckkraft'),'brush-opacity',S.brush.opacity,1,100)}<label class="checkbox"><input type="checkbox" id="fill-contiguous" ${S.fill.contiguous?'checked':''}>Nur zusammenhängende Flächen</label>`,'G')+colorPanel()+toolTip(tr('Farbe für die Fläche'),tr('Klicke auf eine Fläche der ausgewählten Ebene. Eine höhere Toleranz erfasst mehr ähnliche Farben.'));break;
      case 'background':panelHTML=section(tr('Hintergrundradierer'),html`${slider(tr('Farbtoleranz'),'bg-tolerance',S.bg.tolerance)}<label class="checkbox"><input type="checkbox" id="bg-contiguous" ${S.bg.contiguous?'checked':''}>Nur zusammenhängende Flächen</label>`,'R')+toolTip(tr('Ein Klick. Mehr Transparenz.'),tr('Klicke auf eine Hintergrundfarbe. Ähnliche Pixel werden auf der gewählten Ebene transparent. Bei komplexen Hintergründen sind mehrere Klicks nötig. Exportiere als PNG, um Transparenz zu erhalten.'));break;
      case 'picker':panelHTML=section(tr('Pipette'),htmlText('<p class="helper">Klicke auf dein Bild, um seine Farbe als Vordergrundfarbe zu übernehmen.</p>'),'I')+colorPanel()+toolTip(tr('Die richtige Nuance'),tr('Die Pipette liest die sichtbare Farbe aus allen eingeblendeten Ebenen.'));break;
      case 'move':panelHTML=section(tr('Verschieben'),l?transformFields(l):htmlText('<p class="helper">Öffne ein Bild, um Ebenen zu verschieben.</p>'),'V')+section(tr('Bild kombinieren'),html`<button class="btn full" data-action="add-image">${icon('plus')}Bild hinzufügen</button><button class="btn full" data-action="paste" style="margin-top:9px">${icon('clipboard')}Aus Zwischenablage</button>`)+toolTip(tr('Bewegungsfreiheit'),tr('Ziehe deine Ebene an die gewünschte Stelle. Mit den Eckpunkten skalierst du proportional; halte Umschalt für freie Proportionen. Die Pfeiltasten verschieben pixelgenau.'));break;
      case 'select':panelHTML=section(tr('Rechteckauswahl'),html`<p class="helper">Ziehe ein Rechteck auf dem Bild. Kopiere den Bereich und füge ihn als bewegliche Ebene ein.</p><div class="action-stack"><button class="btn" data-action="copy">${icon('copy')}Auswahl kopieren</button><button class="btn" data-action="paste">${icon('clipboard')}Einfügen</button><button class="btn" data-action="clear-selection">Auswahl aufheben</button></div>`,'M')+toolTip(tr('Von einem Bild ins andere'),tr('Kopiere deine Auswahl, öffne das zweite Bild und füge die Auswahl mit Strg+V wieder ein. Ohne Auswahl wird das ganze sichtbare Bild kopiert. Pinsel und Fülleimer beachten die Auswahl.'));break;
      case 'crop':panelHTML=section(tr('Zuschneiden'),html`<p class="helper">Ziehe den gewünschten Bildausschnitt auf der Leinwand auf.</p><div class="field"><label class="field-head" for="crop-ratio">Seitenverhältnis</label><select id="crop-ratio"><option value="free">Frei</option value="1">1 : 1 · Quadrat</option><option value="1.333333">4 : 3</option><option value="1.777778">16 : 9</option><option value="0.666667">2 : 3 · Hochformat</option></select></div><div class="action-stack"><button class="btn accent" data-action="apply-crop">${icon('crop')}Zuschneiden</button><button class="btn" data-action="cancel-crop">Abbrechen</button></div>`,'C')+toolTip(tr('Nur das Wesentliche'),tr('Mit Enter übernimmst du den Zuschnitt. Mit Escape verwirfst du ihn. Rückgängig bringt das vollständige Bild zurück.'));break;
      case 'text':{const t=l?.type==='text'?l:S.text;panelHTML=section(l?.type==='text'?tr('Text bearbeiten'):tr('Text hinzufügen'),html`<div class="field"><label class="field-head" for="text-value">Dein Text</label><textarea id="text-value" maxlength="5000" placeholder="Schreib etwas …">${esc(t.value)}</textarea></div><div class="field"><label class="field-head" for="text-font">Schriftart</label><select id="text-font">${['Arial','Georgia','Verdana','Courier New','Impact'].map(f=>html`<option ${t.font===f?'selected':''}>${f}</option>`).join('')}</select></div>${slider(tr('Schriftgröße'),'text-size',t.size,8,400,'px')}<label class="checkbox"><input id="text-bold" type="checkbox" ${t.weight==='700'?'checked':''}>Fett</label><div class="row"><div class="field"><label class="field-head" for="text-color">Textfarbe</label><input id="text-color" type="color" value="${t.color}" class="input" style="height:39px;padding:4px"></div><div class="field"><label class="field-head" for="text-stroke">Randfarbe</label><input id="text-stroke" type="color" value="${t.stroke}" class="input" style="height:39px;padding:4px"></div></div>${slider(tr('Randbreite'),'text-strokeWidth',t.strokeWidth,0,20,'px')}<button class="btn accent full" data-action="add-text" style="margin-top:23px">${icon('plus')}Als neuen Text einfügen</button><p class="helper">Klicke auf die Leinwand, um Text zu platzieren. Verschieben und skalieren kannst du ihn mit dem Verschieben-Werkzeug.</p>`,'T');break;}
      case 'smile':panelHTML=section(tr('Ein bisschen Persönlichkeit'),html`<div class="sticker-grid">${['😊','😎','🥰','😂','🤩','😉','🙃','🥳','❤️','✨','🔥','🌈','☀️','🌸','🍀','👍','🎉','💡','⭐','💬','🚀','🎨','📍','✅','😀','😃','😄','😁','😆','😅','🤣','🙂','😍','😘','😋','😛','😜','🤪','🤗','🤔','🤫','🤭','😴','😮','😢','😭','😡','🤯','👋','👏','🙌','🤝','🙏','👌','✌️','💪','🧡','💛','💚','💙','💜','🖤','💖','💔','🐶','🐱','🦄','🦋','🌻','🎂','🎁','🏆'].map(s=>html`<button class="sticker" data-sticker="${s}" aria-label="Sticker ${s}">${s}</button>`).join('')}</div><p class="helper">Klicken, einfügen, verschieben. Über die Eckpunkte stellst du die Größe ein.</p>`,'S');break;
    }
  }
  $('#panel').innerHTML=panelHTML;
  if(S.tab==='layers')drawThumbnails();if($('#brush-preview'))drawBrushPreview();if($('#airbrush-preview'))drawAirbrushPreview();
}
function transformFields(l){return html`<div class="row">${numberField('X · px','layer-x',l.x,-16384,16384)}${numberField('Y · px','layer-y',l.y,-16384,16384)}</div><div class="row">${numberField(tr('Breite · px'),'layer-w',l.w,1,16384)}${numberField(tr('Höhe · px'),'layer-h',l.h,1,16384)}</div><label class="checkbox"><input type="checkbox" id="lock-ratio" checked>Seitenverhältnis beibehalten</label>`;}
function rawDraw(c,l){if(!l.visible)return;c.save();c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.globalAlpha=l.opacity;c.globalCompositeOperation=l.blend||'source-over';c.translate(l.x,l.y);if(l.type==='text'){c.scale(l.w/l.naturalW,l.h/l.naturalH);c.font=`${l.weight} ${l.size}px "${l.font}"`;c.textBaseline='top';c.textAlign='left';c.lineJoin='round';c.fillStyle=l.color;c.strokeStyle=l.stroke;c.lineWidth=l.strokeWidth*2;const pad=l.strokeWidth+3;l.value.split('\n').forEach((line,i)=>{if(l.strokeWidth)c.strokeText(line,pad,pad+i*l.size*1.25);c.fillText(line,pad,pad+i*l.size*1.25);});}else c.drawImage(l.canvas,0,0,l.w,l.h);c.restore();}
function drawThumbnails(){S.layers.forEach(l=>{const thumb=$(`[data-thumb="${l.id}"]`);if(!thumb)return;const c=thumb.getContext('2d'),scale=Math.min(76/S.width,68/S.height);c.clearRect(0,0,76,68);c.save();c.translate((76-S.width*scale)/2,(68-S.height*scale)/2);c.scale(scale,scale);rawDraw(c,{...l,visible:true});c.restore();});}
function drawEffectPreview(c,l){c.save();c.globalCompositeOperation=l.blend||'source-over';c.drawImage(S.previewCanvas,0,0);c.restore();}
function composite(includePreview=true){const c=C.canvas(S.width,S.height),cx=c.getContext('2d');S.layers.forEach(l=>{if(includePreview&&S.previewCanvas&&l.id===S.active&&l.visible)drawEffectPreview(cx,l);else rawDraw(cx,l);});return c;}
function render(){renderFrame=0;if(!S.loaded)return;if(mainCanvas.width!==S.width||mainCanvas.height!==S.height){mainCanvas.width=overlay.width=S.width;mainCanvas.height=overlay.height=S.height;}ctx.clearRect(0,0,S.width,S.height);S.layers.forEach(l=>{if(S.previewCanvas&&l.id===S.active&&l.visible)drawEffectPreview(ctx,l);else rawDraw(ctx,l);});drawOverlay();}
function scheduleRender(){if(!renderFrame)renderFrame=requestAnimationFrame(render);}
function dashedRect(r,color='#148c77'){if(!r)return;const z=S.zoom;ov.save();ov.lineWidth=1.3/z;ov.setLineDash([5/z,4/z]);ov.strokeStyle='white';ov.strokeRect(r.x,r.y,r.w,r.h);ov.lineDashOffset=4/z;ov.strokeStyle=color;ov.strokeRect(r.x,r.y,r.w,r.h);ov.restore();}
function drawOverlay(){ov.clearRect(0,0,S.width,S.height);const z=S.zoom;
  if(S.crop){const r=S.crop;ov.save();ov.fillStyle='#17292377';ov.beginPath();ov.rect(0,0,S.width,S.height);ov.rect(r.x,r.y,r.w,r.h);ov.fill('evenodd');ov.strokeStyle='#ffffff90';ov.lineWidth=1/z;for(let i=1;i<3;i++){ov.beginPath();ov.moveTo(r.x+r.w*i/3,r.y);ov.lineTo(r.x+r.w*i/3,r.y+r.h);ov.moveTo(r.x,r.y+r.h*i/3);ov.lineTo(r.x+r.w,r.y+r.h*i/3);ov.stroke();}ov.restore();dashedRect(r);}
  if(S.selection)dashedRect(S.selection);
  if(S.tool==='move'&&active()?.visible){const r=bounds();ov.save();ov.strokeStyle='#138d77';ov.lineWidth=1.3/z;ov.strokeRect(r.x,r.y,r.w,r.h);for(const p of corners(r)){ov.fillStyle='white';ov.fillRect(p.x-4/z,p.y-4/z,8/z,8/z);ov.strokeRect(p.x-4/z,p.y-4/z,8/z,8/z);}ov.restore();}
  if(S.lineStart&&S.tool==='line'){
    const end=S.cursor||S.lineStart;ov.save();clipSelection(ov);drawLine(ov,S.lineStart,end);ov.restore();
    for(const p of [S.lineStart,end]){ov.save();ov.beginPath();ov.arc(p.x,p.y,4/z,0,Math.PI*2);ov.fillStyle='white';ov.fill();ov.lineWidth=1.3/z;ov.strokeStyle='#138d77';ov.stroke();ov.restore();}
  }
  if(S.gesture?.type==='geometry'&&S.gesture.preview){const g=S.gesture;ov.save();ov.globalAlpha=g.opacity/100;ov.drawImage(g.preview.canvas,g.preview.x,g.preview.y);ov.restore();}
  if(S.cursor&&['brush','eraser','airbrush','smudge','marker'].includes(S.tool)){
    const settings=paintSettings(),rx=settings.size/2,ry=rx*(settings.thickness??100)/100;
    ov.save();ov.lineWidth=1/z;ov.strokeStyle='white';ov.beginPath();
    if(S.tool==='marker'||S.tool==='brush'&&settings.shape==='square')ov.rect(S.cursor.x-rx,S.cursor.y-ry,rx*2,ry*2);
    else ov.ellipse(S.cursor.x,S.cursor.y,rx,ry,0,0,Math.PI*2);
    ov.stroke();ov.lineWidth=.6/z;ov.strokeStyle='#203b30';ov.stroke();ov.restore();
  }
}
function corners(r){return[{x:r.x,y:r.y},{x:r.x+r.w,y:r.y},{x:r.x+r.w,y:r.y+r.h},{x:r.x,y:r.y+r.h}];}
function resizeView(){if(!S.loaded)return;const area=$('#canvas-area');if(S.fit)S.zoom=C.clamp(Math.min((area.clientWidth-70)/S.width,(area.clientHeight-70)/S.height,1),.03,8);const stack=$('#canvas-stack');stack.style.width=`${S.width*S.zoom}px`;stack.style.height=`${S.height*S.zoom}px`;$('#zoom-label').textContent=`${Math.round(S.zoom*100)} %`;drawOverlay();}
function syncUI(panel=true){$('#empty').hidden=S.loaded;$('#canvas-stack').hidden=!S.loaded;$('#export-btn').disabled=!S.loaded;$('#image-size-btn').disabled=!S.loaded;$('#docname').textContent=S.loaded?docName():tr('Dein kreativer Freiraum');$('#dimensions').textContent=S.loaded?`${S.width.toLocaleString(PixelI18n.language)} × ${S.height.toLocaleString(PixelI18n.language)} px`:tr('Noch kein Bild geöffnet');$('#status-hint').textContent=S.loaded?tr('Lokal · keine Bildübertragung'):'';$('#layer-count').textContent=S.layers.length||'';$('#undo-btn').disabled=S.historyIndex<=0;$('#redo-btn').disabled=S.historyIndex>=S.history.length-1;$('#history-label').textContent=S.loaded?tr(S.history[S.historyIndex]?.label||'Bereit'):tr('Alles beginnt mit einem Bild');$$('[data-tool]').forEach(b=>{b.classList.toggle('active',b.dataset.tool===S.tool);b.setAttribute('aria-pressed',String(b.dataset.tool===S.tool));});$('#rail-color').value=toolColor();overlay.style.cursor=['brush','eraser','airbrush','smudge','marker'].includes(S.tool)?'none':S.tool==='move'?'move':['text'].includes(S.tool)?'text':'crosshair';if(panel)renderPanel();updateCanvasActions();scheduleRender();}
function updateCanvasActions(){const target=$('#canvas-actions');if(S.lineStart&&S.tool==='line')target.innerHTML=html`<div class="selection-bubble"><span class="btn small" style="border:0">Endpunkt wählen</span><button class="icon-btn" data-action="cancel-line" title="Linie abbrechen" aria-label="Linie abbrechen">${icon('close')}</button></div>`;else if(S.crop)target.innerHTML=html`<div class="selection-bubble"><span class="btn small" style="border:0">${Math.round(S.crop.w)} × ${Math.round(S.crop.h)} px</span><button class="btn small accent" data-action="apply-crop">${icon('check')}Übernehmen</button><button class="icon-btn" data-action="cancel-crop" aria-label="Zuschnitt abbrechen">${icon('close')}</button></div>`;else if(S.selection&&S.tool==='select')target.innerHTML=html`<div class="selection-bubble"><span class="btn small" style="border:0">${Math.round(S.selection.w)} × ${Math.round(S.selection.h)} px</span><button class="btn small" data-action="copy">${icon('copy')}Kopieren</button><button class="icon-btn" data-action="clear-selection" aria-label="Auswahl aufheben">${icon('close')}</button></div>`;else target.innerHTML='';}
function setTool(tool){if(!toolDefs.some(t=>t[0]===tool))return;finishGesture();cancelLine();flushEdit();resetEffects(false);S.pickerTarget=tool==='picker'?colorTarget():null;S.tool=tool;S.tab='tool';S.crop=null;S.cursor=null;syncUI();}
function setTab(tab){finishGesture();flushEdit();if(tab!=='effects')resetEffects(false);S.tab=tab;renderPanel();scheduleRender();}
function cloneLayer(l){return l.type==='raster'?{...l,canvas:C.clone(l.canvas)}:{...l};}
function historySize(h){return h.layers.reduce((sum,l)=>sum+(l.canvas?l.canvas.width*l.canvas.height*4:2000),0);}
function checkpoint(label){clearTimeout(editTimer);editTimer=0;S.history=S.history.slice(0,S.historyIndex+1);S.history.push({width:S.width,height:S.height,name:S.name,nameKey:S.nameKey,active:S.active,layers:S.layers.map(cloneLayer),label});while(S.history.length>2&&(S.history.length>25||S.history.reduce((n,h)=>n+historySize(h),0)>192*1024*1024))S.history.shift();S.historyIndex=S.history.length-1;S.changed=true;syncUI(false);if(S.tab==='layers')drawThumbnails();}
function editCheckpoint(){clearTimeout(editTimer);editTimer=setTimeout(()=>checkpoint(tr('Eigenschaften geändert')),600);}
function flushEdit(){if(editTimer)checkpoint(tr('Eigenschaften geändert'));}
function restoreHistory(direction){finishGesture();if(cancelLine())return;flushEdit();const index=S.historyIndex+direction;if(index<0||index>=S.history.length)return;const h=S.history[index];S.historyIndex=index;S.width=h.width;S.height=h.height;S.name=h.name;S.nameKey=h.nameKey;S.active=h.active;S.layers=h.layers.map(cloneLayer);S.selection=S.crop=null;resetEffects(false);S.changed=true;resizeView();syncUI();}
function rasterLayer(canvas,name=null,nameKey=null){if(name===null){name=tr('Bildebene');nameKey='Bildebene';}return{id:nextId(),type:'raster',name,nameKey,canvas,x:0,y:0,w:canvas.width,h:canvas.height,visible:true,opacity:1};}
function clearDocument(w,h,name,layers,nameKey=null){finishGesture();cancelLine();clearTimeout(editTimer);editTimer=0;S.width=w;S.height=h;S.name=name;S.nameKey=nameKey;S.layers=layers;S.active=layers.at(-1)?.id;S.loaded=true;S.selection=S.crop=null;S.history=[];S.historyIndex=-1;S.fit=true;S.cursor=null;resetEffects(false);checkpoint(tr('Bild geöffnet'));S.changed=false;syncUI();resizeView();}
function checkSize(w,h){if(!Number.isInteger(w)||!Number.isInteger(h)||w<1||h<1)throw new Error(tr('Bitte gib positive ganze Pixelwerte ein.'));if(!Number.isFinite(w)||!Number.isFinite(h)||w<1||h<1||w>8192||h>8192||w*h>20000000)throw new Error(tr('Bitte wähle höchstens 8.192 Pixel pro Seite und insgesamt 20 Megapixel.'));}
async function loadFile(file,asLayer=false){if(!file)return;if(!/\.(png|jpe?g|bmp)$/i.test(file.name||'')&&!/^image\/(png|jpeg|bmp|x-ms-bmp)$/.test(file.type))return toast(tr('Bitte wähle eine JPG-, PNG- oder BMP-Datei.'),true);if(file.size>80*1024*1024)return toast(tr('Die Datei ist zu groß. Maximal 80 MB pro Bild.'),true);
  const url=URL.createObjectURL(file);try{const img=new Image();img.src=url;await img.decode();checkSize(img.naturalWidth,img.naturalHeight);const c=C.canvas(img.naturalWidth,img.naturalHeight);c.getContext('2d').drawImage(img,0,0);const name=(file.name||tr('Eingefügtes Bild')).replace(/\.[^.]+$/,'');if(asLayer&&S.loaded)addRaster(c,name);else{clearDocument(c.width,c.height,name,[rasterLayer(c,tr('Hintergrund'),'Hintergrund')]);S.tool='move';syncUI();}toast(asLayer&&S.layers.length>1?tr('Bild als neue Ebene eingefügt.'):tr('Bild geöffnet. Alles bleibt auf deinem Gerät.'));}catch(e){toast(/megapixel/i.test(e.message)?e.message:tr('Dieses Bild konnte nicht gelesen werden. Probiere eine andere JPG-, PNG- oder BMP-Datei.'),true);}finally{URL.revokeObjectURL(url);}}
function addRaster(c,name=null,nameKey=null){finishGesture();cancelLine();if(name===null){name=tr('Eingefügtes Bild');nameKey='Eingefügtes Bild';}flushEdit();resetEffects(false);if(!S.loaded){clearDocument(c.width,c.height,name,[rasterLayer(c,name,nameKey)]);return;}const l=rasterLayer(C.clone(c),name,nameKey);const scale=Math.min(1,S.width/c.width,S.height/c.height);l.w=c.width*scale;l.h=c.height*scale;l.x=(S.width-l.w)/2;l.y=(S.height-l.h)/2;S.layers.push(l);S.active=l.id;S.tool='move';S.selection=null;S.tab='tool';checkpoint(tr('Bild eingefügt'));syncUI();}
function ensureRaster({erase=false,retouch=false}={}){
  let layer=active();
  if((erase||retouch)&&!layer){toast(tr(retouch?'Wähle zuerst eine Ebene zum Verschmieren.':'Wähle zuerst eine Ebene zum Radieren.'));return null;}
  if((erase||retouch)&&layer.type==='text'){
    const bitmap=C.canvas(S.width,S.height);
    rawDraw(bitmap.getContext('2d'),{...layer,visible:true,opacity:1});
    Object.assign(layer,{type:'raster',canvas:bitmap,x:0,y:0,w:S.width,h:S.height,visible:true});
    toast(tr(retouch?'Text oder Sticker wurde zum Verschmieren in Pixel umgewandelt. Rückgängig stellt die Textebene wieder her.':'Text oder Sticker wurde zum Radieren in Pixel umgewandelt. Rückgängig stellt die Textebene wieder her.'));
  }else if(!layer||layer.type==='text'){
    layer=rasterLayer(C.canvas(S.width,S.height),tr('Malebene'),'Malebene');
    S.layers.push(layer);S.active=layer.id;
  }
  if(!layer.visible){layer.visible=true;toast(tr('Die ausgewählte Ebene wurde eingeblendet.'));}
  if(layer.x!==0||layer.y!==0||layer.w!==S.width||layer.h!==S.height||layer.canvas.width!==S.width||layer.canvas.height!==S.height){
    const bitmap=C.canvas(S.width,S.height);
    rawDraw(bitmap.getContext('2d'),{...layer,opacity:1});
    Object.assign(layer,{canvas:bitmap,x:0,y:0,w:S.width,h:S.height});
  }
  return layer;
}
function textMetrics(l){const c=ctx;c.save();c.font=`${l.weight} ${l.size}px "${l.font}"`;const lines=l.value.split('\n');const w=Math.max(1,...lines.map(s=>c.measureText(s).width))+l.strokeWidth*2+6;const h=lines.length*l.size*1.25+l.strokeWidth*2+6;c.restore();return{w,h};}
function updateText(l){const rx=l.w/(l.naturalW||l.w||1),ry=l.h/(l.naturalH||l.h||1),m=textMetrics(l);l.naturalW=m.w;l.naturalH=m.h;l.w=m.w*rx;l.h=m.h*ry;}
function addText(x,y,sticker=null){if(!hasDoc())return;finishGesture();cancelLine();flushEdit();const t=sticker?{...S.text,value:sticker,size:120,font:'Arial',strokeWidth:0,weight:'400'}:{...S.text};if(!t.value.trim())return toast(tr('Gib zuerst einen Text ein.'));const m=textMetrics(t);const l={...t,id:nextId(),type:'text',name:sticker?`Sticker ${sticker}`:t.value.slice(0,30),x:x??(S.width-m.w)/2,y:y??(S.height-m.h)/2,w:m.w,h:m.h,naturalW:m.w,naturalH:m.h,visible:true,opacity:1};S.layers.push(l);S.active=l.id;S.selection=null;S.tool=sticker?'move':'text';checkpoint(sticker?tr('Sticker eingefügt'):tr('Text eingefügt'));syncUI();}
function setColor(color){
  if(!/^#[0-9a-f]{6}$/i.test(color))return;const target=colorTarget();color=color.toUpperCase();
  if(target)S[target].color=color;else{S.color=color;S.text.color=color;}
  $('#rail-color').value=color;if($('#main-color'))$('#main-color').value=color;if($('#hex-color'))$('#hex-color').value=color;
  if($('#brush-preview'))drawBrushPreview();if($('#airbrush-preview'))drawAirbrushPreview();drawOverlay();
}
function drawBrushPreview(){
  const canvas=$('#brush-preview');if(!canvas)return;
  const context=canvas.getContext('2d'),settings=paintSettings(),erasing=S.tool==='eraser';
  context.clearRect(0,0,canvas.width,canvas.height);
  const size=Math.min(45,Math.max(5,settings.size))*1.5;
  const tip=C.brushTip(size,settings.thickness,settings.hardness,erasing?'#000000':S.color,erasing?'round':settings.shape);
  const stroke=C.canvas(420,128),strokeContext=stroke.getContext('2d');
  strokeContext.globalAlpha=settings.density/100;
  for(let i=28;i<390;i+=2)strokeContext.drawImage(tip,i-tip.width/2,65+Math.sin(i/68)*13-tip.height/2);
  context.save();
  if(erasing){context.fillStyle='#91A69A';context.fillRect(0,0,canvas.width,canvas.height);context.globalCompositeOperation='destination-out';}
  context.globalAlpha=settings.opacity/100;context.drawImage(stroke,0,0);context.restore();
}
function drawAirbrushPreview(){
  const canvas=$('#airbrush-preview');if(!canvas)return;
  const c=canvas.getContext('2d');c.clearRect(0,0,canvas.width,canvas.height);
  const stroke=C.canvas(canvas.width,canvas.height),g={stroke,color:S.color,size:Math.min(74,S.airbrush.size),current:{x:385,y:64},sprayLast:{x:35,y:64}};
  let seed=12345;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  sprayDots(g,Math.round(20+S.airbrush.density*5),random);
  c.save();c.globalAlpha=S.airbrush.opacity/100;c.drawImage(stroke,0,0);c.restore();
}
function clipSelection(c){if(S.selection){c.beginPath();c.rect(S.selection.x,S.selection.y,S.selection.w,S.selection.h);c.clip();}}
function drawLine(c,start,end){
  c.save();c.globalAlpha=S.line.opacity/100;c.strokeStyle=c.fillStyle=S.color;c.lineWidth=S.line.width;c.lineCap='round';
  c.beginPath();if(start.x===end.x&&start.y===end.y){c.arc(start.x,start.y,S.line.width/2,0,Math.PI*2);c.fill();}
  else{c.moveTo(start.x,start.y);c.lineTo(end.x,end.y);c.stroke();}c.restore();
}
function cancelLine(){
  if(!S.lineStart)return false;S.lineStart=null;updateCanvasActions();if(S.tool==='line')renderPanel();scheduleRender();return true;
}
function lineClick(p){
  if(S.lineStart&&S.lineStart.layerId!==S.active)cancelLine();
  if(!S.lineStart)S.lineStart={...p,layerId:S.active};
  else{
    const start=S.lineStart,layer=ensureRaster();S.lineStart=null;
    const c=layer.canvas.getContext('2d');c.save();clipSelection(c);drawLine(c,start,p);c.restore();checkpoint('Linie gezeichnet');
  }
  updateCanvasActions();renderPanel();scheduleRender();
}
function sprayDots(g,count,random=Math.random){
  const c=g.stroke.getContext('2d'),radius=g.size/2,dot=Math.max(.6,Math.min(2,g.size/75));
  c.save();c.fillStyle=g.color;
  for(let i=0;i<count;i++){
    const along=random(),angle=random()*Math.PI*2,distance=Math.sqrt(random()),r=radius*distance;
    const x=g.sprayLast.x+(g.current.x-g.sprayLast.x)*along+Math.cos(angle)*r,y=g.sprayLast.y+(g.current.y-g.sprayLast.y)*along+Math.sin(angle)*r;
    c.globalAlpha=.2+.8*(1-distance);c.beginPath();c.arc(x,y,dot,0,Math.PI*2);c.fill();
  }
  c.restore();
}
function sprayTick(time){
  sprayFrame=0;const g=S.gesture;if(!g||g.type!=='spray')return;
  const elapsed=g.lastTime===null?33:time-g.lastTime;
  if(elapsed>=32){
    g.lastTime=time;g.particles+=g.rate*Math.min(elapsed,64)/1000;
    const count=Math.floor(g.particles);g.particles-=count;
    if(count){sprayDots(g,count);paintComposite();}g.sprayLast={...g.current};
  }
  sprayFrame=requestAnimationFrame(sprayTick);
}
function imageLimits(){
  const r=S.selection||{x:0,y:0,w:S.width,h:S.height},x=Math.max(0,Math.ceil(r.x)),y=Math.max(0,Math.ceil(r.y));
  return{x,y,w:Math.max(0,Math.min(S.width,Math.floor(r.x+r.w))-x),h:Math.max(0,Math.min(S.height,Math.floor(r.y+r.h))-y)};
}
function smudgeAt(p){
  const g=S.gesture,x=Math.round(p.x-g.side/2),y=Math.round(p.y-g.side/2);if(x===g.sampleX&&y===g.sampleY)return;
  const c=g.layer.canvas.getContext('2d'),d=c.getImageData(x,y,g.side,g.side);
  C.smudgeDab(d,g.pickup,{strength:g.strength,hardness:g.hardness,x,y,bounds:g.limits});c.putImageData(d,x,y);g.sampleX=x;g.sampleY=y;
}
function cropMarker(g){
  const b=g.bounds,limit=imageLimits(),x=Math.max(limit.x,Math.floor(b.x)),y=Math.max(limit.y,Math.floor(b.y)),right=Math.min(limit.x+limit.w,Math.ceil(b.r)),bottom=Math.min(limit.y+limit.h,Math.ceil(b.b));
  if(right<=x||bottom<=y)return;
  const canvas=C.canvas(right-x,bottom-y);canvas.getContext('2d').drawImage(g.layer.canvas,x,y,canvas.width,canvas.height,0,0,canvas.width,canvas.height);
  Object.assign(g.layer,{canvas,x,y,w:canvas.width,h:canvas.height});
}
function arrowPoints(g){
  const dx=g.end.x-g.start.x,dy=g.end.y-g.start.y,len=Math.hypot(dx,dy);if(len<1)return null;
  const ux=dx/len,uy=dy/len,w=Math.min(g.width,len*.25),head=Math.min(len*.65,Math.max(12,w*3.5)),wide=Math.max(w,head*.55),base={x:g.end.x-ux*head,y:g.end.y-uy*head};
  const offset=(p,d)=>({x:p.x-uy*d,y:p.y+ux*d});
  return[offset(g.start,w/2),offset(base,w/2),offset(base,wide),g.end,offset(base,-wide),offset(base,-w/2),offset(g.start,-w/2)];
}
function geometryBitmap(g){
  const points=g.tool==='arrow'?arrowPoints(g):null,rect={x:Math.min(g.start.x,g.end.x),y:Math.min(g.start.y,g.end.y),w:Math.abs(g.end.x-g.start.x),h:Math.abs(g.end.y-g.start.y)};
  if(g.tool==='arrow'?!points:rect.w<1||rect.h<1)return null;
  const vertices=points||[{x:rect.x,y:rect.y},{x:rect.x+rect.w,y:rect.y+rect.h}],pad=g.tool==='arrow'?2:g.width/2+2,limit=imageLimits();
  const x=Math.max(limit.x,Math.floor(Math.min(...vertices.map(p=>p.x))-pad)),y=Math.max(limit.y,Math.floor(Math.min(...vertices.map(p=>p.y))-pad));
  const right=Math.min(limit.x+limit.w,Math.ceil(Math.max(...vertices.map(p=>p.x))+pad)),bottom=Math.min(limit.y+limit.h,Math.ceil(Math.max(...vertices.map(p=>p.y))+pad));
  if(right<=x||bottom<=y)return null;
  const canvas=C.canvas(right-x,bottom-y),c=canvas.getContext('2d');c.translate(-x,-y);clipSelection(c);c.fillStyle=c.strokeStyle=g.color;c.lineWidth=g.width;c.lineJoin='miter';c.miterLimit=2;
  if(points){c.beginPath();c.moveTo(points[0].x,points[0].y);for(const p of points.slice(1))c.lineTo(p.x,p.y);c.closePath();c.fill();}
  else if(g.kind==='ellipse'){c.beginPath();c.ellipse(rect.x+rect.w/2,rect.y+rect.h/2,rect.w/2,rect.h/2,0,0,Math.PI*2);c.stroke();}
  else c.strokeRect(rect.x,rect.y,rect.w,rect.h);
  return{canvas,x,y,w:canvas.width,h:canvas.height};
}
function updateGeometry(g,p,shift=false){
  let dx=p.x-g.start.x,dy=p.y-g.start.y;
  if(g.tool==='shape'&&(g.locked||shift)){
    const sx=dx<0?-1:1,sy=dy<0?-1:1,size=Math.min(Math.max(Math.abs(dx),Math.abs(dy)),sx<0?g.start.x:S.width-g.start.x,sy<0?g.start.y:S.height-g.start.y);dx=sx*size;dy=sy*size;
  }else if(g.tool==='arrow'&&shift){const len=Math.hypot(dx,dy),angle=Math.round(Math.atan2(dy,dx)/(Math.PI/4))*Math.PI/4;dx=Math.cos(angle)*len;dy=Math.sin(angle)*len;}
  g.end={x:C.clamp(g.start.x+dx,0,S.width),y:C.clamp(g.start.y+dy,0,S.height)};g.preview=geometryBitmap(g);drawOverlay();
}
function commitGeometry(g){
  if(!g.preview)return;const name=g.tool==='arrow'?'Pfeil':g.kind==='ellipse'?'Oval':'Rechteck';
  const layer={...rasterLayer(g.preview.canvas,tr(name),name),x:g.preview.x,y:g.preview.y,opacity:g.opacity/100};S.layers.push(layer);S.active=layer.id;checkpoint(g.tool==='arrow'?'Pfeil gezeichnet':'Form gezeichnet');syncUI();
}
function cancelGeometry(){
  const g=S.gesture;if(g?.type!=='geometry')return false;S.gesture=null;
  if(overlay.hasPointerCapture(g.pointerId))overlay.releasePointerCapture(g.pointerId);scheduleRender();return true;
}
function finishGesture(){if(S.gesture)pointerUp({pointerId:S.gesture.pointerId});}
function point(e,clipped=true){const b=overlay.getBoundingClientRect();const p={x:(e.clientX-b.left)*S.width/b.width,y:(e.clientY-b.top)*S.height/b.height};return clipped?{x:C.clamp(p.x,0,S.width),y:C.clamp(p.y,0,S.height)}:p;}
function within(p,r){return p.x>=r.x&&p.y>=r.y&&p.x<=r.x+r.w&&p.y<=r.y+r.h;}
function hitLayer(p){return S.layers.slice().reverse().find(l=>l.visible&&within(p,l));}
function pointerDown(e){if(e.button!==0||e.isPrimary===false||S.gesture||!S.loaded)return;e.preventDefault();flushEdit();resetEffects(false);overlay.focus({preventScroll:true});overlay.setPointerCapture(e.pointerId);const p=point(e);S.cursor=p;
  if(['brush','eraser'].includes(S.tool)){
    const erase=S.tool==='eraser',l=ensureRaster({erase});if(!l)return;
    const settings=paintSettings(),stroke=C.canvas(S.width,S.height);
    S.gesture={type:'paint',layer:l,before:C.clone(l.canvas),stroke,tip:C.brushTip(settings.size,settings.thickness,settings.hardness,erase?'#000000':S.color,erase?'round':settings.shape),last:p,opacity:settings.opacity/100,density:settings.density/100,spacing:Math.max(.6,settings.size*.09),erase};
    paintStamp(p);paintComposite();
  }
  else if(S.tool==='smudge'){
    const layer=ensureRaster({retouch:true});if(!layer)return;const side=Math.max(1,Math.round(S.smudge.size)),x=Math.round(p.x-side/2),y=Math.round(p.y-side/2),pickup=layer.canvas.getContext('2d').getImageData(x,y,side,side),limits=imageLimits();
    for(let yy=0;yy<side;yy++)for(let xx=0;xx<side;xx++)if(x+xx<limits.x||x+xx>=limits.x+limits.w||y+yy<limits.y||y+yy>=limits.y+limits.h)pickup.data[(yy*side+xx)*4+3]=0;
    S.gesture={type:'smudge',layer,pickup,side,strength:S.smudge.strength,hardness:S.smudge.hardness,limits,sampleX:x,sampleY:y,last:p};
  }
  else if(S.tool==='marker'){
    const layer=rasterLayer(C.canvas(S.width,S.height),tr('Textmarker'),'Textmarker'),settings=S.marker;layer.opacity=settings.opacity/100;layer.blend=settings.dark?'screen':'multiply';S.layers.push(layer);S.active=layer.id;
    S.gesture={type:'paint',marker:true,layer,stroke:layer.canvas,tip:C.brushTip(settings.size,100,100,settings.color,'square'),last:p,start:p,density:1,spacing:Math.max(.6,settings.size*.09),size:settings.size,bounds:{x:p.x,y:p.y,r:p.x,b:p.y}};
    paintStamp(p);paintComposite();syncUI(false);
  }
  else if(['arrow','shape'].includes(S.tool))S.gesture={type:'geometry',tool:S.tool,start:p,end:p,...S[S.tool],preview:null};
  else if(S.tool==='airbrush'){
    const layer=ensureRaster(),settings=S.airbrush;
    S.gesture={type:'spray',pointerId:e.pointerId,layer,before:C.clone(layer.canvas),stroke:C.canvas(S.width,S.height),size:settings.size,color:S.color,opacity:settings.opacity/100,current:p,sprayLast:p,lastTime:null,particles:0,rate:Math.max(40,settings.size*settings.size*.12)*settings.density/100};
    sprayDots(S.gesture,Math.max(1,Math.round(S.gesture.rate*.02)));paintComposite();sprayFrame=requestAnimationFrame(sprayTick);
  }
  else if(S.tool==='line')lineClick(p);
  else if(['fill','background'].includes(S.tool)){const l=ensureRaster({erase:S.tool==='background'});if(!l)return;const c=l.canvas.getContext('2d'),data=c.getImageData(0,0,S.width,S.height),settings=S.tool==='fill'?S.fill:S.bg;C.regionPixels(data,Math.min(S.width-1,p.x),Math.min(S.height-1,p.y),{...settings,color:C.hexRGB(S.color),opacity:S.tool==='background'?1:S.brush.opacity/100,erase:S.tool==='background',bounds:S.selection});c.putImageData(data,0,0);checkpoint(S.tool==='background'?tr('Hintergrund entfernt'):tr('Fläche gefüllt'));}
  else if(S.tool==='picker'){render();const d=ctx.getImageData(Math.min(S.width-1,Math.floor(p.x)),Math.min(S.height-1,Math.floor(p.y)),1,1).data;if(d[3]===0)toast(tr('Dieser Pixel ist transparent.'));else{setColor('#'+[...d].slice(0,3).map(v=>v.toString(16).padStart(2,'0')).join(''));toast(tr('Farbe {color} aufgenommen.',{color:toolColor()}));if(S.pickerTarget){const target=S.pickerTarget;setTool(target);}}}
  else if(S.tool==='select'||S.tool==='crop'){S.gesture={type:S.tool,start:p};S[S.tool==='crop'?'crop':'selection']={x:p.x,y:p.y,w:0,h:0};}
  else if(S.tool==='text'){const hit=hitLayer(p);if(hit?.type==='text'){S.active=hit.id;renderPanel();S.gesture={type:'move',layer:hit,start:p,original:{x:hit.x,y:hit.y,w:hit.w,h:hit.h},changed:false};}else addText(p.x,p.y);}
  else if(S.tool==='move'){let l=active(),corner=-1;if(l?.visible)corner=corners(l).findIndex(q=>Math.hypot(q.x-p.x,q.y-p.y)<10/S.zoom);if(corner<0){l=hitLayer(p);if(l)S.active=l.id;}if(l){S.gesture={type:corner>=0?'resize':'move',layer:l,start:p,corner,original:{x:l.x,y:l.y,w:l.w,h:l.h},changed:false};renderPanel();}}
  if(S.gesture)S.gesture.pointerId=e.pointerId;
  scheduleRender();
}
function paintStamp(p){
  const g=S.gesture,sc=g.stroke.getContext('2d');sc.save();if(g.marker){clipSelection(sc);g.bounds.x=Math.min(g.bounds.x,p.x-g.size/2-2);g.bounds.y=Math.min(g.bounds.y,p.y-g.size/2-2);g.bounds.r=Math.max(g.bounds.r,p.x+g.size/2+2);g.bounds.b=Math.max(g.bounds.b,p.y+g.size/2+2);}
  sc.globalAlpha=g.density;sc.drawImage(g.tip,p.x-g.tip.width/2,p.y-g.tip.height/2);sc.restore();
}
function paintComposite(){const g=S.gesture;if(g.marker){scheduleRender();return;}const c=g.layer.canvas.getContext('2d');c.clearRect(0,0,S.width,S.height);c.drawImage(g.before,0,0);c.save();if(S.selection){c.beginPath();c.rect(S.selection.x,S.selection.y,S.selection.w,S.selection.h);c.clip();}c.globalAlpha=g.opacity;c.globalCompositeOperation=g.erase?'destination-out':'source-over';c.drawImage(g.stroke,0,0);c.restore();scheduleRender();}
function pointerMove(e){if(!S.loaded||S.gesture&&e.pointerId!==undefined&&S.gesture.pointerId!==e.pointerId)return;const p=point(e,!['move','resize'].includes(S.gesture?.type));S.cursor=p;const g=S.gesture;if(!g){drawOverlay();return;}
  if(g.type==='paint'){if(g.marker&&e.shiftKey){if(Math.abs(p.x-g.start.x)>=Math.abs(p.y-g.start.y))p.y=g.start.y;else p.x=g.start.x;}const d=Math.hypot(p.x-g.last.x,p.y-g.last.y),step=g.spacing,n=Math.max(1,Math.ceil(d/step));for(let i=1;i<=n;i++)paintStamp({x:g.last.x+(p.x-g.last.x)*i/n,y:g.last.y+(p.y-g.last.y)*i/n});g.last=p;paintComposite();}
  else if(g.type==='smudge'){const dx=p.x-g.last.x,dy=p.y-g.last.y,n=Math.max(1,Math.ceil(Math.hypot(dx,dy)/Math.max(1,g.side*.1)));for(let i=1;i<=n;i++)smudgeAt({x:g.last.x+dx*i/n,y:g.last.y+dy*i/n});g.last=p;scheduleRender();}
  else if(g.type==='geometry')updateGeometry(g,p,e.shiftKey);
  else if(g.type==='spray'){g.current=p;drawOverlay();}
  else if(g.type==='select'||g.type==='crop'){let dx=p.x-g.start.x,dy=p.y-g.start.y;const ratio=g.type==='crop'?Number($('#crop-ratio')?.value)||0:(e.shiftKey?1:0);if(ratio){if(Math.abs(dx)/Math.max(.01,Math.abs(dy))>ratio)dx=Math.sign(dx)*Math.abs(dy)*ratio;else dy=Math.sign(dy)*Math.abs(dx)/ratio;}const x=Math.round(Math.min(g.start.x,g.start.x+dx)),y=Math.round(Math.min(g.start.y,g.start.y+dy));S[g.type==='crop'?'crop':'selection']={x,y,w:Math.max(1,Math.round(Math.abs(dx))),h:Math.max(1,Math.round(Math.abs(dy)))};updateCanvasActions();scheduleRender();}
  else if(g.type==='move'){g.layer.x=Math.round(g.original.x+p.x-g.start.x);g.layer.y=Math.round(g.original.y+p.y-g.start.y);g.changed=true;syncTransformInputs();scheduleRender();}
  else if(g.type==='resize'){const old=g.original,opposite=corners(old)[(g.corner+2)%4],left=g.corner===0||g.corner===3,top=g.corner===0||g.corner===1;let w=Math.max(8,left?opposite.x-p.x:p.x-opposite.x),h=Math.max(8,top?opposite.y-p.y:p.y-opposite.y);if(!e.shiftKey){const r=old.w/old.h;if(w/h>r)h=w/r;else w=h*r;}w=Math.min(w,16384);h=Math.min(h,16384);g.layer.x=left?opposite.x-w:opposite.x;g.layer.y=top?opposite.y-h:opposite.y;g.layer.w=w;g.layer.h=h;g.changed=true;syncTransformInputs();scheduleRender();}
}
function pointerUp(e){
  const g=S.gesture;if(g&&e.pointerId!==undefined&&g.pointerId!==e.pointerId)return;
  cancelAnimationFrame(sprayFrame);sprayFrame=0;
  if(g?.type==='spray'&&(g.current.x!==g.sprayLast.x||g.current.y!==g.sprayLast.y)){sprayDots(g,Math.max(1,Math.round(g.rate*.016)));paintComposite();}
  if(g?.type==='geometry'&&Number.isFinite(e.clientX)&&Number.isFinite(e.clientY))updateGeometry(g,point(e),e.shiftKey);
  if(g?.marker)cropMarker(g);S.gesture=null;
  if(g?.type==='geometry'){if(e.type!=='pointercancel')commitGeometry(g);}
  else if(g?.type==='smudge')checkpoint('Verschmiert');
  else if(g?.marker){checkpoint('Text markiert');syncUI();}
  else if(g?.type==='paint')checkpoint(g.erase?tr('Radiert'):tr('Pinselstrich'));
  else if(g?.type==='spray')checkpoint('Gesprüht');
  else if(g?.changed)checkpoint(g.type==='resize'?tr('Ebene skaliert'):tr('Ebene verschoben'));
  else if(g?.type==='crop'||g?.type==='select'){const key=g.type==='crop'?'crop':'selection';if(S[key]?.w<2||S[key]?.h<2)S[key]=null;updateCanvasActions();}
  if(e.pointerId!==undefined&&overlay.hasPointerCapture(e.pointerId))overlay.releasePointerCapture(e.pointerId);scheduleRender();
}
function syncTransformInputs(){const l=active();if(!l)return;['x','y','w','h'].forEach(k=>{const e=$(`#layer-${k}`);if(e&&document.activeElement!==e)e.value=Math.round(l[k]);});}
function applyCrop(){if(!hasDoc())return;if(!S.crop)return toast(tr('Ziehe zuerst einen Ausschnitt auf der Leinwand auf.'));const r=S.crop;if(r.w<1||r.h<1)return;S.layers.forEach(l=>{l.x-=r.x;l.y-=r.y;});S.width=Math.min(S.width-r.x,Math.round(r.w));S.height=Math.min(S.height-r.y,Math.round(r.h));S.crop=S.selection=null;S.fit=true;checkpoint(tr('Bild zugeschnitten'));resizeView();syncUI();toast(tr('Zuschnitt übernommen.'));}
async function copySelection(){if(!hasDoc())return;flushEdit();const r=S.selection||{x:0,y:0,w:S.width,h:S.height},c=C.canvas(r.w,r.h),full=composite();c.getContext('2d').drawImage(full,r.x,r.y,r.w,r.h,0,0,r.w,r.h);S.clipboard=c;S.clipboardLocalOnly=true;try{if(navigator.clipboard?.write&&window.ClipboardItem){const blob=await new Promise(resolve=>c.toBlob(resolve,'image/png'));await navigator.clipboard.write([new ClipboardItem({'image/png':blob})]);S.clipboardLocalOnly=false;toast(tr('Kopiert. Mit Strg+V als neue Ebene einfügen.'));}else toast(tr('Intern kopiert. Über „Einfügen“ im Editor einsetzen.'));}catch{toast(tr('Intern kopiert. Über „Einfügen“ im Editor einsetzen.'));}}
async function pasteClipboard(){if(S.clipboard&&S.clipboardLocalOnly){addRaster(S.clipboard,tr('Kopierte Auswahl'),'Kopierte Auswahl');toast(tr('Auswahl als neue Ebene eingefügt.'));return;}try{if(navigator.clipboard?.read){const items=await navigator.clipboard.read();for(const item of items){const type=item.types.find(t=>/^image\/(png|jpeg|bmp)/.test(t));if(type){const blob=await item.getType(type);await loadFile(new File([blob],tr('Zwischenablage.')+(type==='image/jpeg'?'jpg':type==='image/bmp'?'bmp':'png'),{type}),S.loaded);return;}}}}catch{}if(S.clipboard){addRaster(S.clipboard,tr('Kopierte Auswahl'),'Kopierte Auswahl');toast(tr('Auswahl als neue Ebene eingefügt.'));}else toast(tr('Nutze Strg+V (Mac: ⌘V), um ein kopiertes Bild einzufügen.'));}
function resetEffects(redraw=true){S.fx={contrast:0,brightness:0,saturation:0,effect:'none'};S.previewCanvas=null;cancelAnimationFrame(fxFrame);if(redraw){renderPanel();scheduleRender();}}
function previewEffects(){cancelAnimationFrame(fxFrame);fxFrame=requestAnimationFrame(()=>{if(!S.loaded||!active())return;const c=C.canvas(S.width,S.height),x=c.getContext('2d');rawDraw(x,{...active(),visible:true});const d=x.getImageData(0,0,S.width,S.height);C.effects(d,S.fx,S.selection);x.putImageData(d,0,0);S.previewCanvas=c;scheduleRender();});}
function applyEffects(){if(!hasDoc()||!active())return;cancelAnimationFrame(fxFrame);const l=active(),c=C.canvas(S.width,S.height),x=c.getContext('2d');rawDraw(x,{...l,visible:true});const d=x.getImageData(0,0,S.width,S.height);C.effects(d,S.fx,S.selection);x.putImageData(d,0,0);Object.assign(l,{type:'raster',canvas:c,x:0,y:0,w:S.width,h:S.height,opacity:1});resetEffects(false);checkpoint(tr('Effekt angewendet'));renderPanel();toast(tr('Anpassung auf die Ebene angewendet.'));}
function mutateLayer(action){if(!hasDoc())return;finishGesture();cancelLine();flushEdit();resetEffects(false);const l=active(),i=S.layers.indexOf(l);if(action==='add-layer'){const n=rasterLayer(C.canvas(S.width,S.height),tr('Leere Ebene'),'Leere Ebene');S.layers.push(n);S.active=n.id;}else if(!l)return;else if(action==='delete-layer'){S.layers.splice(i,1);S.active=S.layers[Math.max(0,i-1)]?.id||null;}else if(action==='duplicate'){const n=cloneLayer(l);n.id=nextId();n.copies=(l.copies||0)+1;n.x+=20;n.y+=20;S.layers.splice(i+1,0,n);S.active=n.id;}else if(action==='layer-up'&&i<S.layers.length-1){[S.layers[i],S.layers[i+1]]=[S.layers[i+1],S.layers[i]];}else if(action==='layer-down'&&i>0){[S.layers[i],S.layers[i-1]]=[S.layers[i-1],S.layers[i]];}else return;checkpoint(tr('Ebenen bearbeitet'));syncUI();}
function docName(){return S.nameKey?tr(S.nameKey):S.name;}
function layerName(layer){return (layer.nameKey?tr(layer.nameKey):layer.name)+tr(' Kopie').repeat(layer.copies||0);}
function updateLanguageButtons(){
  $$('[data-language]').forEach(button=>{
    const selected=button.dataset.language===PixelI18n.language;
    button.classList.toggle('active',selected);
    button.setAttribute('aria-pressed',String(selected));
  });
}
function setLanguage(language){
  if(!['de','en'].includes(language)||language===PixelI18n.language)return;
  finishGesture();flushEdit();
  const cropRatio=$('#crop-ratio')?.value,locked=$('#lock-ratio')?.checked;
  PixelI18n.setLanguage(language);
  if(!S.textEdited)S.text.value=tr('Dein Text');
  localizeShell();
  updateLanguageButtons();
  $('#toast').hidden=true;
  syncUI();
  resizeView();
  if(cropRatio!==undefined&&$('#crop-ratio'))$('#crop-ratio').value=cropRatio;
  if(locked!==undefined&&$('#lock-ratio'))$('#lock-ratio').checked=locked;
}
let resizeDraft=null;
function resizeDialog(){
  if(!hasDoc())return;
  flushEdit();
  resizeDraft={width:S.width,height:S.height,ratio:S.width/S.height,last:'resize-width'};
  openDialog(html`${dialogHead(tr('Bildgröße ändern'))}
    <p class="dialog-desc">Das gesamte Bild einschließlich aller Ebenen wird auf die neuen Pixelmaße skaliert.</p>
    <div class="resize-current">${icon('image')}<span>${tr('Aktuell: {width} × {height} px',{width:S.width,height:S.height})}</span></div>
    <form id="resize-form">
      <div class="row">${numberField(tr('Breite · px'),'resize-width',S.width,1,8192)}${numberField(tr('Höhe · px'),'resize-height',S.height,1,8192)}</div>
      <label class="checkbox resize-lock"><input type="checkbox" id="resize-proportions" checked aria-describedby="resize-guidance">${icon('lock')}Proportionen beibehalten</label>
      <p class="helper" id="resize-guidance">Bei aktivierter Sperre wird der andere Wert automatisch berechnet. Ohne Sperre lassen sich Breite und Höhe unabhängig ändern.</p>
      <div class="resize-summary" aria-live="polite"><strong id="resize-result"></strong><span id="resize-scale"></span><span id="resize-error" class="resize-error" role="alert"></span></div>
      <div class="dialog-actions"><button type="button" class="btn" data-action="close-dialog">Abbrechen</button><button class="btn accent" type="submit" id="resize-apply">Bild skalieren</button></div>
    </form>`);
  for(const id of ['resize-width','resize-height']){$('#'+id).required=true;$('#'+id).step='1';}
  updateResizeDraft('resize-width');
  $('#resize-width').focus();
  $('#resize-width').select();
}
function updateResizeDraft(changed){
  if(!resizeDraft||!$('#resize-width'))return;
  const width=$('#resize-width'),height=$('#resize-height'),locked=$('#resize-proportions').checked;
  const source=changed==='resize-height'?height:width;
  resizeDraft.last=changed;
  const value=Number(source.value);
  if(locked&&source.value!==''&&Number.isInteger(value)&&value>0){
    if(changed==='resize-height')width.value=Math.max(1,Math.round(value*resizeDraft.ratio));
    else height.value=Math.max(1,Math.round(value/resizeDraft.ratio));
  }
  const w=Number(width.value),h=Number(height.value);
  let error='';
  try{checkSize(w,h);}catch(err){error=err.message;}
  width.setCustomValidity(error);height.setCustomValidity(error);
  $('#resize-error').textContent=error;
  $('#resize-apply').disabled=!!error;
  $('#resize-result').textContent=error?'':tr('Neue Größe: {width} × {height} px',{width:w,height:h});
  $('#resize-scale').textContent=error?'':tr('Breite {width} % · Höhe {height} %',{width:(w/resizeDraft.width*100).toLocaleString(PixelI18n.language,{maximumFractionDigits:1}),height:(h/resizeDraft.height*100).toLocaleString(PixelI18n.language,{maximumFractionDigits:1})});
}
function resizeImage(width,height){
  // Validate before touching the document or its undo history.
  checkSize(width,height);
  if(!S.loaded)throw new Error(tr('Öffne ein Bild oder erstelle eine neue Leinwand.'));
  if(S.gesture)throw new Error(tr('Bitte beende zuerst die aktuelle Bearbeitung.'));
  if(width===S.width&&height===S.height)return{width,height,layers:S.layers.length};
  cancelLine();flushEdit();
  const scaleX=width/S.width,scaleY=height/S.height;
  S.layers.forEach(layer=>{
    layer.x*=scaleX;layer.y*=scaleY;layer.w*=scaleX;layer.h*=scaleY;
  });
  // Rectangular selections and pending crops follow the image transformation.
  for(const rect of [S.selection,S.crop])if(rect){
    const x=C.clamp(Math.round(rect.x*scaleX),0,width-1),y=C.clamp(Math.round(rect.y*scaleY),0,height-1);
    const right=C.clamp(Math.round((rect.x+rect.w)*scaleX),x+1,width),bottom=C.clamp(Math.round((rect.y+rect.h)*scaleY),y+1,height);
    Object.assign(rect,{x,y,w:right-x,h:bottom-y});
  }
  S.width=width;S.height=height;S.cursor=null;S.fit=true;
  S.previewCanvas=null;cancelAnimationFrame(fxFrame);
  checkpoint('Bildgröße geändert');
  resizeView();syncUI();
  if(S.fx.contrast||S.fx.brightness||S.fx.saturation||S.fx.effect!=='none')previewEffects();
  return{width,height,layers:S.layers.length};
}

function openDialog(content){const d=$('#dialog');d.innerHTML=content;d.showModal();}
function dialogHead(title){return html`<div class="dialog-heading"><h2>${tr(title)}</h2><button class="icon-btn" data-action="close-dialog" aria-label="Schließen">${icon('close')}</button></div>`;}
function newDialog(){openDialog(html`${dialogHead(tr('Eine neue Leinwand'))}<p class="dialog-desc">Der Platz für deinen nächsten Entwurf.</p><form id="new-form"><div class="row">${numberField(tr('Breite · px'),'new-width',1200,1,8192)}${numberField(tr('Höhe · px'),'new-height',800,1,8192)}</div><div class="field"><label class="field-head" for="new-bg">Hintergrund</label><select id="new-bg"><option value="white">Weiß</option><option value="transparent">Transparent</option><option value="color">Aktuelle Vordergrundfarbe</option></select></div>${S.changed?htmlText('<p class="helper">Dein aktuelles Bild wird ersetzt. Exportiere es vorher, wenn du es behalten möchtest.</p>'):''}<div class="dialog-actions"><button type="button" class="btn" data-action="close-dialog">Abbrechen</button><button class="btn accent" type="submit">Leinwand erstellen</button></div></form>`);}
function exportDialog(){if(!hasDoc())return;flushEdit();openDialog(html`${dialogHead(tr('Dein Bild. Zum Mitnehmen.'))}<p class="dialog-desc">Direkt von deinem Browser auf dein Gerät.</p><img class="dialog-preview" id="export-preview" alt="Vorschau des exportierten Bildes"><form id="export-form"><div class="field"><label class="field-head" for="export-name">Dateiname</label><input id="export-name" type="text" value="${esc(docName())}" required maxlength="120"></div><div class="field"><label class="field-head" for="export-format">Dateiformat</label><select id="export-format"><option value="png">PNG · mit Transparenz</option><option value="jpeg">JPG · kleinere Datei</option><option value="bmp">BMP · unkomprimiert</option></select></div><div id="quality-field" hidden>${slider(tr('Qualität'),'export-quality',92,10,100)}</div><p class="helper" id="export-help">PNG bewahrt transparente Bereiche. Vorschau-Effekte werden mit exportiert.</p><div class="dialog-actions"><button class="btn" type="button" data-action="close-dialog">Abbrechen</button><button class="btn accent" type="submit">${icon('download')}Herunterladen</button></div></form>`);const c=composite();$('#export-preview').src=c.toDataURL('image/png');}
async function exportImage(name,format,quality=.92){if(!hasDoc())return;const source=composite();let c=source;if(format!=='png'){c=C.canvas(S.width,S.height);const x=c.getContext('2d');x.fillStyle='white';x.fillRect(0,0,S.width,S.height);x.drawImage(source,0,0);}let blob;if(format==='bmp')blob=new Blob([C.encodeBMP(c)],{type:'image/bmp'});else blob=await new Promise(resolve=>c.toBlob(resolve,format==='jpeg'?'image/jpeg':'image/png',quality));if(!blob)throw new Error(tr('Der Export ist fehlgeschlagen.'));const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download=(name.trim().replace(/[\\/:*?"<>|]/g,'_')||'Pixelwerk')+'.'+(format==='jpeg'?'jpg':format);document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);S.changed=false;return{format,width:S.width,height:S.height,bytes:blob.size};}
function helpDialog(){openDialog(html`${dialogHead(tr('Schneller im Flow'))}<p class="dialog-desc">Alle Bilder werden lokal verarbeitet. Es gibt keinen Bild-Upload auf einen Server und keine automatische Speicherung. Lade dein Ergebnis vor dem Schließen herunter.</p><div style="margin-top:20px">${[[tr('Rückgängig'),tr('Strg / ⌘ + Z')],[tr('Wiederholen'),tr('Strg / ⌘ + Umschalt + Z')],[tr('Kopieren / Einfügen'),tr('Strg / ⌘ + C / V')],[tr('Auswahl aufheben'),'Escape'],[tr('Zuschnitt übernehmen'),'Enter'],[tr('Ebene verschieben'),tr('Pfeiltasten')],[tr('Größerer Schritt'),tr('Umschalt + Pfeil')],[tr('Pinselgröße'),'[ / ]'],[tr('Sprühdose'),'A'],[tr('Linie'),'L'],[tr('Linie abbrechen'),'Escape'],[tr('Schmierfinger'),'D'],[tr('Textmarker'),'H'],[tr('Pfeil'),'P'],[tr('Formen'),'U']].map(([a,b])=>html`<div class="tip-line"><span>${a}</span><kbd>${b}</kbd></div>`).join('')}</div><p class="helper">PNG unterstützt Transparenz. JPG und BMP erhalten beim Export einen weißen Hintergrund. Der Hintergrundradierer entfernt ähnliche Farben; er ist keine automatische Motiverkennung. Bis 20 Megapixel, maximal 8.192 Pixel pro Seite.</p><div class="dialog-actions"><button class="btn accent" data-action="close-dialog">Alles klar</button></div>`);}
function confirmReplace(fn){if(!S.changed)return fn();openDialog(html`${dialogHead(tr('Anderes Bild öffnen?'))}<p class="dialog-desc">Dein aktueller Entwurf wird ersetzt. Lade ihn vorher herunter, wenn du ihn behalten möchtest.</p><div class="dialog-actions"><button class="btn" data-action="close-dialog">Abbrechen</button><button class="btn accent" id="replace-confirm">Bild öffnen</button></div>`);$('#replace-confirm').onclick=()=>{$('#dialog').close();fn();};}
const actions={'cancel-line':cancelLine,'resize-image':resizeDialog,open:()=>confirmReplace(()=>$('#file-open').click()),new:newDialog,export:exportDialog,undo:()=>restoreHistory(-1),redo:()=>restoreHistory(1),'add-image':()=>$('#file-layer').click(),copy:copySelection,paste:pasteClipboard,'clear-selection':()=>{S.selection=null;updateCanvasActions();renderPanel();scheduleRender();},'apply-crop':applyCrop,'cancel-crop':()=>{S.crop=null;updateCanvasActions();scheduleRender();},'add-text':()=>addText(),'apply-effects':applyEffects,'reset-effects':()=>resetEffects(),'close-dialog':()=>$('#dialog').close(),help:helpDialog,'zoom-in':()=>setZoom(S.zoom*1.25),'zoom-out':()=>setZoom(S.zoom/1.25),'zoom-100':()=>setZoom(1),fit:()=>{S.fit=true;resizeView();},'toggle-panel':()=>{const open=$('#inspector').classList.toggle('mobile-open');$('[data-action="toggle-panel"]').setAttribute('aria-expanded',String(open));},'add-layer':()=>mutateLayer('add-layer'),'delete-layer':()=>mutateLayer('delete-layer'),duplicate:()=>mutateLayer('duplicate'),'layer-up':()=>mutateLayer('layer-up'),'layer-down':()=>mutateLayer('layer-down')};
function setZoom(v){S.fit=false;S.zoom=C.clamp(v,.03,8);resizeView();}
document.addEventListener('click',e=>{const b=e.target.closest('button,[data-layer]');if(!b||b.disabled)return;if(b.dataset.language){setLanguage(b.dataset.language);return;}if(b.dataset.action){actions[b.dataset.action]?.();return;}if(b.dataset.form&&['rect','ellipse'].includes(b.dataset.form)){S.shape.kind=b.dataset.form;renderPanel();return;}if(b.dataset.tipShape&&['round','square'].includes(b.dataset.tipShape)){S.brush.shape=b.dataset.tipShape;renderPanel();drawOverlay();return;}if(b.dataset.tool){setTool(b.dataset.tool);return;}if(b.dataset.tab){setTab(b.dataset.tab);return;}if(b.dataset.color){setColor(b.dataset.color);return;}if(b.dataset.sticker){addText(null,null,b.dataset.sticker);return;}if(b.dataset.effect){S.fx.effect=b.dataset.effect;$$('[data-effect]').forEach(t=>{const on=t.dataset.effect===S.fx.effect;t.classList.toggle('active',on);t.setAttribute('aria-pressed',on);});previewEffects();return;}if(b.dataset.visibility){finishGesture();cancelLine();flushEdit();resetEffects(false);const l=S.layers.find(x=>x.id===b.dataset.visibility);l.visible=!l.visible;checkpoint(tr('Sichtbarkeit geändert'));renderPanel();return;}if(b.dataset.layer){finishGesture();cancelLine();flushEdit();resetEffects(false);S.active=b.dataset.layer;syncUI();}});
document.addEventListener('input',e=>{const el=e.target,id=el.id,v=Number(el.value);if(el.type==='range'){const out=$(`#${id}-out`);if(out)out.textContent=`${el.value} ${id.includes('size')||id.includes('strokeWidth')||['line-width','arrow-width','shape-width'].includes(id)?'px':'%'}`;el.style.setProperty('--pct',`${(v-Number(el.min))/(Number(el.max)-Number(el.min))*100}%`);}
  if(id==='resize-width'||id==='resize-height')updateResizeDraft(id);
  if(id==='main-color'||id==='rail-color')setColor(el.value);
  else if(id.startsWith('brush-')){const key=id.slice(6);const settings=paintSettings();if(key in settings&&key!=='shape'){settings[key]=v;drawBrushPreview();drawOverlay();}}
  else if(id.startsWith('airbrush-')){const key=id.slice(9);if(key in S.airbrush){S.airbrush[key]=v;drawAirbrushPreview();drawOverlay();}}
  else if(id.startsWith('line-')){const key=id.slice(5);if(key in S.line){S.line[key]=v;drawOverlay();}}
  else if(/^(smudge|marker|arrow|shape)-/.test(id)){const [tool,key]=id.split('-');if(typeof S[tool]?.[key]==='number'){S[tool][key]=v;drawOverlay();}}
  else if(id==='fill-tolerance')S.fill.tolerance=v;else if(id==='bg-tolerance')S.bg.tolerance=v;
  else if(id.startsWith('fx-')){S.fx[id.slice(3)]=v;previewEffects();}
  else if(id==='layer-opacity'&&active()){active().opacity=v/100;editCheckpoint();scheduleRender();}
  else if(id.startsWith('text-')){const key=id.slice(5),l=active()?.type==='text'?active():null;let property=key,value=el.value;if(['size','strokeWidth'].includes(key))value=v;if(key==='bold'){property='weight';value=el.checked?'700':'400';}if(property in S.text){if(property==='value')S.textEdited=true;S.text[property]=value;if(l){l[property]=value;l.name=l.value.slice(0,30);l.nameKey=null;l.copies=0;updateText(l);editCheckpoint();scheduleRender();}}}
});
document.addEventListener('change',e=>{const el=e.target,id=el.id;if(id==='hex-color'){if(/^#[0-9a-f]{6}$/i.test(el.value))setColor(el.value);else{el.value=toolColor();toast(tr('Nutze einen Hex-Farbcode, z. B. #148A75.'),true);}}
  if(id==='marker-dark')S.marker.dark=el.checked;if(id==='shape-locked')S.shape.locked=el.checked;
  if(id==='eraser-layer'){finishGesture();cancelLine();flushEdit();resetEffects(false);if(S.layers.some(layer=>layer.id===el.value)){S.active=el.value;syncUI();}}
  if(id==='resize-proportions')updateResizeDraft(resizeDraft.last);
  if(id==='fill-contiguous')S.fill.contiguous=el.checked;if(id==='bg-contiguous')S.bg.contiguous=el.checked;
  if(['layer-x','layer-y','layer-w','layer-h'].includes(id)&&active()){const l=active(),key=id.slice(6),v=Number(el.value);if(!Number.isFinite(v)||(key==='w'||key==='h')&&v<1){renderPanel();return;}const n=C.clamp(v,Number(el.min),Number(el.max));if($('#lock-ratio')?.checked&&key==='w')l.h*=n/l.w;if($('#lock-ratio')?.checked&&key==='h')l.w*=n/l.h;l[key]=n;checkpoint(tr('Ebene angepasst'));syncTransformInputs();}
  if(id==='export-format'){$('#quality-field').hidden=el.value!=='jpeg';$('#export-help').textContent=el.value==='png'?tr('PNG bewahrt transparente Bereiche. Vorschau-Effekte werden mit exportiert.'):tr('Transparente Bereiche werden weiß. Vorschau-Effekte werden mit exportiert.');}
  if(id==='file-open'){loadFile(el.files[0],false);el.value='';}if(id==='file-layer'){const files=[...el.files];el.value='';(async()=>{for(const f of files)await loadFile(f,true);})();}
});
document.addEventListener('submit',async e=>{e.preventDefault();if(e.target.id==='resize-form'){try{const w=Number($('#resize-width').value),h=Number($('#resize-height').value);resizeImage(w,h);$('#dialog').close();toast(tr('Bild auf {width} × {height} px skaliert.',{width:w,height:h}));}catch(err){toast(err.message,true);}return;}if(e.target.id==='new-form'){try{const w=Math.round(Number($('#new-width').value)),h=Math.round(Number($('#new-height').value));checkSize(w,h);const c=C.canvas(w,h),x=c.getContext('2d'),bg=$('#new-bg').value;if(bg!=='transparent'){x.fillStyle=bg==='white'?'#FFFFFF':S.color;x.fillRect(0,0,w,h);}clearDocument(w,h,tr('Unbenannt'),[rasterLayer(c,tr('Hintergrund'),'Hintergrund')],'Unbenannt');S.tool='brush';syncUI();$('#dialog').close();}catch(err){toast(err.message,true);}}
  if(e.target.id==='export-form'){const name=$('#export-name').value,format=$('#export-format').value,q=Number($('#export-quality').value)/100;try{await exportImage(name,format,q);$('#dialog').close();toast(tr('Dein Bild wurde heruntergeladen.'));}catch(err){toast(err.message,true);}}
});
overlay.addEventListener('pointerdown',pointerDown);overlay.addEventListener('pointermove',pointerMove);overlay.addEventListener('pointerup',pointerUp);overlay.addEventListener('pointercancel',pointerUp);overlay.addEventListener('lostpointercapture',e=>{if(S.gesture)pointerUp(e);});overlay.addEventListener('pointerleave',()=>{if(!S.gesture){S.cursor=null;drawOverlay();}});
overlay.addEventListener('dblclick',e=>{if(!['move','text'].includes(S.tool))return;const l=hitLayer(point(e));if(l?.type==='text'){S.active=l.id;setTool('text');$('#text-value')?.focus();}});
document.addEventListener('paste',e=>{if(/INPUT|TEXTAREA/.test(document.activeElement?.tagName)||$('#dialog').open)return;const image=[...(e.clipboardData?.items||[])].find(i=>i.type.startsWith('image/'));if(image){e.preventDefault();loadFile(image.getAsFile(),S.loaded);}else if(S.clipboard){e.preventDefault();addRaster(S.clipboard,tr('Kopierte Auswahl'),'Kopierte Auswahl');}});
document.addEventListener('copy',e=>{if(/INPUT|TEXTAREA/.test(document.activeElement?.tagName)||$('#dialog').open||!S.loaded)return;e.preventDefault();e.clipboardData?.setData('text/plain',tr('Pixelwerk: kopierte Bildauswahl'));copySelection();});
document.addEventListener('keydown',e=>{const editing=/INPUT|TEXTAREA|SELECT/.test(e.target.tagName);if(editing||$('#dialog').open)return;const mod=e.ctrlKey||e.metaKey,k=e.key.toLowerCase();if(e.target.matches('[data-layer]')&&(e.key==='Enter'||e.key===' ')){e.preventDefault();e.target.click();return;}if(mod&&k==='z'){e.preventDefault();restoreHistory(e.shiftKey?1:-1);return;}if(mod&&k==='y'){e.preventDefault();restoreHistory(1);return;}if(mod&&k==='s'){e.preventDefault();exportDialog();return;}if(mod&&k==='a'&&S.loaded){e.preventDefault();S.selection={x:0,y:0,w:S.width,h:S.height};setTool('select');return;}if(mod||e.altKey)return;if(e.key==='Escape'){if(cancelGeometry())return;finishGesture();if(cancelLine())return;S.selection=S.crop=null;resetEffects(false);syncUI();return;}if(e.key==='Enter'&&S.crop){e.preventDefault();applyCrop();return;}if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)&&S.tool==='move'&&active()){e.preventDefault();const n=e.shiftKey?10:1,l=active();if(e.key==='ArrowLeft')l.x-=n;if(e.key==='ArrowRight')l.x+=n;if(e.key==='ArrowUp')l.y-=n;if(e.key==='ArrowDown')l.y+=n;editCheckpoint();syncTransformInputs();scheduleRender();return;}if(e.key==='Delete'&&S.tool==='move'){mutateLayer('delete-layer');return;}if(k==='['||k===']'){const stroked=['line','arrow','shape'].includes(S.tool),settings=stroked?S[S.tool]:paintSettings(),key=stroked?'width':'size',max=S.tool==='line'?200:['arrow','shape'].includes(S.tool)?100:S.tool==='marker'?160:300;settings[key]=C.clamp(settings[key]+(k===']'?5:-5),S.tool==='marker'?2:1,max);renderPanel();drawOverlay();return;}const tool=toolDefs.find(t=>t[2].toLowerCase()===k);if(tool)setTool(tool[0]);});
const area=$('#canvas-area');let dragDepth=0;area.addEventListener('dragenter',e=>{e.preventDefault();dragDepth++;area.classList.add('dragover');});area.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='copy';});area.addEventListener('dragleave',()=>{if(--dragDepth<=0)area.classList.remove('dragover');});area.addEventListener('drop',async e=>{e.preventDefault();dragDepth=0;area.classList.remove('dragover');for(const file of e.dataTransfer.files)await loadFile(file,S.loaded);});
window.addEventListener('blur',finishGesture);window.addEventListener('pagehide',finishGesture);document.addEventListener('visibilitychange',()=>{if(document.hidden)finishGesture();});
window.addEventListener('beforeunload',e=>{if(S.changed){e.preventDefault();e.returnValue='';}});new ResizeObserver(()=>resizeView()).observe(area);
function registerAgentTools(){const mc=document.modelContext;if(!mc?.registerTool)return;const lifecycle=new AbortController();const register=(tool)=>{try{Promise.resolve(mc.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}};
  register({name:'get_editor_state',title:tr('Bildzustand lesen'),description:tr('Liest Maße, Werkzeuge und Ebenen des lokal geöffneten Bildes. Liefert keine Bilddaten.'),inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:true},execute:()=>({loaded:S.loaded,width:S.loaded?S.width:null,height:S.loaded?S.height:null,name:docName(),language:PixelI18n.language,tool:S.tool,layers:S.layers.map(l=>({id:l.id,name:layerName(l),type:l.type,x:l.x,y:l.y,width:l.w,height:l.h,opacity:l.opacity,visible:l.visible})),activeLayer:S.active})});
  register({name:'select_editor_tool',title:tr('Bildwerkzeug wählen'),description:tr('Wählt ein Werkzeug im lokalen Bildeditor. Verändert keine Bildpixel.'),inputSchema:{type:'object',properties:{tool:{type:'string',enum:toolDefs.map(t=>t[0])}},required:['tool'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:input=>{if(!input||typeof input!=='object'||!toolDefs.some(t=>t[0]===input.tool)||Object.keys(input).some(k=>k!=='tool'))throw new Error(tr('Ungültiges Werkzeug.'));setTool(input.tool);return{tool:S.tool};}});
  register({name:'set_active_layer_position',title:tr('Ebene positionieren'),description:tr('Verschiebt die aktuell ausgewählte Ebene auf absolute Pixelkoordinaten. Rückgängig ist verfügbar.'),inputSchema:{type:'object',properties:{x:{type:'number',minimum:-16384,maximum:16384},y:{type:'number',minimum:-16384,maximum:16384}},required:['x','y'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:input=>{if(!input||typeof input!=='object'||Object.keys(input).some(k=>!['x','y'].includes(k))||!Number.isFinite(input.x)||!Number.isFinite(input.y)||Math.abs(input.x)>16384||Math.abs(input.y)>16384)throw new Error(tr('Ungültige Position.'));if(!S.loaded||!active())throw new Error(tr('Keine Ebene ausgewählt.'));flushEdit();resetEffects(false);Object.assign(active(),{x:input.x,y:input.y});checkpoint(tr('Ebene verschoben'));syncUI();return{id:S.active,x:active().x,y:active().y};}});
  register({name:'resize_image',title:tr('Bildgröße ändern'),description:tr('Bildgröße auf absolute Pixelmaße ändern. Skaliert alle Ebenen und erhält ihre Bearbeitbarkeit. Rückgängig ist verfügbar.'),inputSchema:{type:'object',properties:{width:{type:'integer',minimum:1,maximum:8192},height:{type:'integer',minimum:1,maximum:8192}},required:['width','height'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:input=>{if(!input||typeof input!=='object'||Object.keys(input).some(key=>!['width','height'].includes(key)))throw new Error(tr('Bitte gib positive ganze Pixelwerte ein.'));return resizeImage(input.width,input.height);}});
  window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
}
PixelI18n.setLanguage(PixelI18n.language,{persist:false});localizeShell();updateLanguageButtons();syncUI();registerAgentTools();
})();
