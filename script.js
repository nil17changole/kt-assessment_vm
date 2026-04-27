function login(){
fetch('/enterprise_kta/api/login.php',{
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
  alert(data.message || "Invalid login");
  return;
 }

 // ✅ FIXED ABSOLUTE PATHS
 if(data.role === "ADMIN"){
  window.location.href = "/enterprise_kta/admin/dashboard.php";
  return;
 }

 if(data.role === "SUPERADMIN"){
  window.location.href = "/enterprise_kta/superadmin/dashboard.php";
  return;
 }

 // EMPLOYEE FLOW
 fetch('/enterprise_kta/api/check.php?id='+data.id)
 .then(res=>res.json())
 .then(a=>{

   if(!a || !a.id){
     alert("Assessment not open for you");
     return;
   }

   localStorage.setItem("topic", a.topic_id);
   localStorage.setItem("duration", a.duration_minutes);

   window.location.href = "/enterprise_kta/employee/assessment.php";

 });

})
.catch(err=>{
 console.error(err);
 alert("Login error");
});
}