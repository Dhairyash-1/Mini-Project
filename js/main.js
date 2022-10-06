import prodb, {
  bulkcreate,
  getData,
  createEle,
  SortObj
} from "./module.js";



let db = prodb("Productdb", {
  Employes: `++id, names, age, designation, gender , dob`
});

// // input tags
const userid = document.getElementById("userid");
const names = document.getElementById("names");
const age = document.getElementById("age");
const designation = document.getElementById("designation");
const gender = document.getElementById("gender");
const dob = document.getElementById("dob");

// // create button
const btncreate = document.getElementById("btn-create");
const btnread = document.getElementById("btn-read");
const btnupdate = document.getElementById("btn-update");
const btndelete = document.getElementById("btn-delete");


// user data

// event listerner for create button
btncreate.onclick = event => {
  // insert values
  let flag = bulkcreate(db.Employes, {
    names: names.value,
    age: age.value,
    designation: designation.value,
    gender: gender.value,
    dob: dob.value
  });



  // reset textbox values
  // names.value = "";
  // age.value = "";
  // designation.value = "";
  // gender.value = "";
  // dob.value = "";
  names.value = age.value = designation.value = gender.value = dob.value = "";

  //   // set id textbox value
  getData(db.Employes, data => {
    userid.value = data.id + 1 || 1;
  });
  table();

  let insertmsg = document.querySelector(".insertmsg");
  getMsg(flag, insertmsg);
};

// // event listerner for create button
btnread.onclick = table;

// button update
btnupdate.onclick = () => {
  const id = parseInt(userid.value || 0);
  if (id) {
    // call dexie update method
    db.Employes.update(id, {
      names: names.value,
      age: age.value,
      designation: designation.value,
      gender: gender.value,
      dob: dob.value
    }).then((updated) => {
      // let get = updated ? `data updated` : `couldn't update data`;
      let get = updated ? true : false;

      // display message
      let updatemsg = document.querySelector(".updatemsg");
      getMsg(get, updatemsg);

      names.value = age.value = designation.value = gender.value = dob.value = "";
      //console.log(get);
    })
  } else {
    console.log(`Please Select id: ${id}`);
  }
}

// delete button
btndelete.onclick = () => {
  db.delete();
  db = prodb("Productdb", {
    Employes: `++id, names, age, designation`
  });
  db.open();
  table();
  textID(userid);
  // display message
  let deletemsg = document.querySelector(".deletemsg");
  getMsg(true, deletemsg);
}

window.onload = event => {
  // set id textbox value
  textID(userid);
};




// create dynamic table
function table() {
  const tbody = document.getElementById("tbody");
  const notfound = document.getElementById("notfound");
  notfound.textContent = "";
  // remove all childs from the dom first
  while (tbody.hasChildNodes()) {
    tbody.removeChild(tbody.firstChild);
  }


  getData(db.Employes, (data, index) => {
    if (data) {
      createEle("tr", tbody, tr => {
        for (const value in data) {
          createEle("td", tr, td => {
            td.textContent = data.designation === data[value] ? ` ${data[value]}` : data[value];
          });
        }
        createEle("td", tr, td => {
          createEle("i", td, i => {
            i.className += "fas fa-edit btnedit";
            i.setAttribute(`data-id`, data.id);
            // store number of edit buttons
            i.onclick = editbtn;
          });
        })
        createEle("td", tr, td => {
          createEle("i", td, i => {
            i.className += "fas fa-trash-alt btndelete";
            i.setAttribute(`data-id`, data.id);
            // store number of edit buttons
            i.onclick = deletebtn;
          });
        })
      });
    } else {
      notfound.textContent = "No record found in the database...!";
    }

  });
}

const editbtn = (event) => {
  let id = parseInt(event.target.dataset.id);
  db.Employes.get(id, function (data) {
    let newdata = SortObj(data);
    userid.value = newdata.id || 0;
    names.value = newdata.names || "";
    age.value = newdata.age || "";
    designation.value = newdata.designation || "";
    gender.value = newdata.gender || "";
    dob.value = newdata.dob || "";
  });
}

// delete icon remove element 
const deletebtn = event => {
  let id = parseInt(event.target.dataset.id);
  db.Employes.delete(id);
  table();
}

// textbox id
function textID(textboxid) {
  getData(db.Employes, data => {
    textboxid.value = data.id + 1 || 1;
  });
}

// function msg
function getMsg(flag, element) {
  if (flag) {
    // call msg 
    element.className += " movedown";

    setTimeout(() => {
      element.classList.forEach(classname => {
        classname == "movedown" ? undefined : element.classList.remove('movedown');
      })
    }, 4000);
  }
}



