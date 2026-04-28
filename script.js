function login(){

fetch('/api?action=login',{
 method:'POST',
 headers:{'Content-Type':'application/json'},
 body: JSON.stringify({
  employee_id: document.getElementById("id").value.trim(),
  password: document.getElementById("pass").value
 })
})
.then(res=>res.json())
.then(data=>{

 console.log("LOGIN RESPONSE:", data);

 if(!data.success){
  alert("Invalid login");
  return;
 }

 // ✅ NEW PATHS (HTML, NOT PHP)
 if(data.role === "ADMIN"){
  window.location.href = "/admin/dashboard.html";
  return;
 }

 if(data.role === "SUPERADMIN"){
  window.location.href = "/superadmin/dashboard.html";
  return;
 }

 // EMPLOYEE
 window.location.href = "/employee/assessment.html";

})
.catch(err=>{
 console.error(err);
 alert("Login error");
});
}
