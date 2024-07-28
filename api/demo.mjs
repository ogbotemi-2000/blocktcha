import {$} from 'execa';

// const {stdout: name};
($`cat package.json`.pipe`grep version`).then(obj=>{
    let {stdout: version} = obj;
    console.log("::OUT::", version)
});
// console.log(name);