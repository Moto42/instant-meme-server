const memesList = [
  'agent',
  'already-dead',
  'awsome-awkward',
  'brain-sleep',
  'eddy-facts',
  'kermit',
  'lifting-cover',
  'lisa',
  'no-yes',
  'spidermen',
  'spongeburn',
  'what-have-you-done',
  'worthless',
];
let currentMeme = memesList.indexOf('kermit');

const templatePath = name => `/instant-meme/templates/${name}.json`;
const imagePath = filename => `/${filename}?`;

function previousMeme(){
  currentMeme = currentMeme == 0 ? memesList.length-1 : currentMeme - 1;
  setupMeme(currentMeme);
}
function nextMeme(){
  currentMeme = currentMeme ==  memesList.length-1 ? 0 : currentMeme + 1;
  setupMeme(currentMeme);
}

/**
 * Loads a new image into a canvas.
 * @param {HTMLCanvasElement} canvas 
 * @param {String} imageSource 
 */
function imageLoader(canvas,imageSource){
  const context = canvas.getContext('2d');
  const image = new Image;
  context.clearRect(0,0, canvas.width, canvas.height);
  image.onload = () => {
    canvas.width = image.naturalWidth;
    canvas.height= image.naturalHeight;
    context.drawImage(image,0,0);
  }
  image.src = imageSource;

}

/**
 * async loads the data for a given memeName.
 * @param {String} memeName the name of the meme to load
 */
async function loadMemeTemplate(memeName){
  const template = await fetch(templatePath(memeName)).then(r => r.json());
  return template;
}

function textInputDiv(text, tid=null) {
  const container = document.createElement('div');
  container.classList.add('textInputContainer');
  
  const textbox = document.createElement('input');
  textbox.classList.add('textInput');
  if(tid) textbox.dataset.tid = tid;
  if(tid) textbox.placeholder = tid;
  textbox.value = text;

  container.appendChild(textbox);
  if(text != ''){
    const defaultNotice = document.createElement('div');
    defaultNotice.classList.add('textInput__default')
    defaultNotice.innerText = `Defaults to: "${text}"`;
    container.appendChild(defaultNotice);
  }
  return container;
}

function upDateMemeURLTextBlocksFromArray(array){
  console.log(array);
  if(Object.entries.length > 0) {
    let textBlocks = '?';
    for(let i in array) {
      const key = array[i][0];
      const value = array[i][1];
      textBlocks += key+'='+encodeURIComponent(value);
      if(i != array.length-1) textBlocks += '&';
    };
    const meme_textBlocks = document.getElementById('memeURL__texts');
    meme_textBlocks.innerText = textBlocks;
  }
}

async function setupInputs(template){
  const inputsDiv = document.getElementById('inputs');
  inputsDiv.innerHTML = '';
  const texts = Object.entries(template.texts);
  for(let entry of texts){
    const id = entry[0];
    const text = entry[1].text;
    const newNode = textInputDiv(text, id);
    newNode.dataset.tid = id;
    newNode.dataset.meme = template.template;
    inputsDiv.appendChild(newNode);
  }
  document.querySelectorAll('.textInput').forEach(n => addEventListener('change',inputChangeHandler));
}
async function setupCanvas(template,memeName){
  const canvas = document.getElementById('template_chooser__template');
  let imageSource= `/${memeName}?`;
  for(let entry of Object.entries(template.texts)){
    const [key, value] = entry;
    imageSource += `${key}=${value.text}&`;
  }
  imageLoader(canvas,imageSource);
}
async function setupOutputs(template, memeName){
  const url_name = document.getElementById('memeURL__name');
  url_name.innerText = memeName;

  const texts = Object.entries(template.texts).map(entry => [entry[0], entry[1].text]);

  upDateMemeURLTextBlocksFromArray(texts);
}
async function setupMeme(memeNumber){
  const memeName = memesList[memeNumber];
  document.getElementById('memeNameDisplay__name').innerText = memeName;
  const template = await loadMemeTemplate(memeName);
  setupCanvas(template,memeName);
  setupInputs(template);
  setupOutputs(template,memeName);
}


async function updateMemeFromInputs(){
  const inputs = document.getElementsByClassName('textInput');
  let imageURL = `/${memesList[currentMeme]}?`;
  Array.from(inputs).forEach(node => {
    if(node.value !== '') imageURL += node.dataset.tid +"="+ encodeURIComponent(node.value)+'&';
  });
  const canvas = document.getElementById('template_chooser__template');
  imageLoader(canvas,imageURL);
}
async function updateMemeURLFromInputs(){
  const textInputs = Array.from(document.getElementsByClassName('textInput')).map(node => [node.dataset.tid, node.value]);
    upDateMemeURLTextBlocksFromArray(textInputs);
}

function inputChangeHandler(event){
  updateMemeFromInputs();
  updateMemeURLFromInputs();
}

setupMeme(currentMeme);
document.getElementById('template_chooser__button--previous').addEventListener('click', previousMeme);
document.getElementById('template_chooser__button--next').addEventListener('click', nextMeme);