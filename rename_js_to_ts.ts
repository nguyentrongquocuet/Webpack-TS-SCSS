 const {readdirSync, rename} = require('fs')
 const path = require('path')

 function walk(
  dir: string,
  fCb = (f) => {}
){
  console.log("WALKING IN DIR:", dir);
  const files = readdirSync(dir, { withFileTypes: true });
  if (!files.length) {
    return null;
  }
  files.forEach((fileD) => {
    const pathTo = path.join(dir, fileD.name);
    if (fileD.isDirectory()) {
      walk(pathTo,fCb);
    } else {
    console.log('Found File', fileD.name)
      fCb(pathTo);
    }
  });
}

walk(path.join(__dirname, "src"),changeName)

function changeName (oldPath:string, oldExt:string='js', newExt:string='ts'){
  const oldReg = new RegExp(`(?=\.${oldExt})`)
  const [name, ext] = oldPath.split(/(?=\.js$)/);
  if(ext){
    const newPath = name+'.'+newExt
    rename(oldPath, newPath, (err)=>{
      if(err) throw err
      console.log(`Changed ${oldPath} to ${newPath}`)
      })
  }
}

//console.log(path.join(__dirname, "src"))