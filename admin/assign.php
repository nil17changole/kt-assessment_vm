<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" href="../assets/style.css">

<style>
.form-box {
    background:#1e293b;
    padding:20px;
    border-radius:10px;
    max-width:500px;
}
.form-box select,
.form-box input {
    width:100%;
    padding:10px;
    margin-top:5px;
    border-radius:6px;
    border:none;
    background:#0f172a;
    color:white;
}
.btn { padding:10px; border:none; border-radius:6px; cursor:pointer; color:white; }
.btn.primary { background:#7c3aed; }
.btn.success { background:#22c55e; }
.btn.danger { background:#ef4444; }

.table-box { margin-top:30px; background:#1e293b; padding:20px; border-radius:10px; }
table { width:100%; border-collapse:collapse; }
td, th { padding:10px; border-bottom:1px solid #334155; }
</style>
</head>

<body>

<div class="sidebar">
<h2>Admin</h2>
<a href="dashboard.html">Dashboard</a>
<a href="results.html">Results</a>
<a href="assign.html">Assign</a>
</div>

<div class="main">

<h1>Assign Assessment</h1>

<div class="form-box">

<label>Employee</label>
<select id="emp"></select>

<label>Topic</label>
<select id="topic"></select>

<label>Duration</label>
<input id="dur" type="number">

<label>Status</label>
<select id="open">
<option value="1">Open</option>
<option value="0">Closed</option>
</select>

<br><br>

<button class="btn primary" onclick="assign()">Assign</button>

</div>

<div class="table-box">
<h2>Assigned Assessments</h2>

<table id="assignTable"></table>
</div>

</div>

<script>

// load employees
fetch('/api/get_employees')
.then(r=>r.json())
.then(d=>{
emp.innerHTML = d.map(e=>`<option value="${e.employee_id}">${e.name}</option>`).join('');
});

// load topics
fetch('/api/get_admin_topics')
.then(r=>r.json())
.then(d=>{
topic.innerHTML = d.map(t=>`<option value="${t.id}">${t.topic_name}</option>`).join('');
});

// assign
function assign(){
fetch('/api/assign',{
method:'POST',
headers:{'Content-Type':'application/json'},
body: JSON.stringify({
emp:emp.value,
topic:topic.value,
duration:dur.value,
open:open.value
})
}).then(()=>load());
}

// load table
function load(){
fetch('/api/get_assignments')
.then(r=>r.json())
.then(d=>{
assignTable.innerHTML = `
<tr><th>Employee</th><th>Topic</th><th>Status</th><th>Action</th></tr>
` + d.map(x=>`
<tr>
<td>${x.employee}</td>
<td>${x.topic}</td>
<td>${x.is_open?'OPEN':'CLOSED'}</td>
<td>
<button onclick="toggle(${x.id},${x.is_open})">
${x.is_open?'Close':'Open'}
</button>
</td>
</tr>
`).join('');
});
}

function toggle(id,status){
fetch('/api/toggle_assessment',{
method:'POST',
headers:{'Content-Type':'application/json'},
body: JSON.stringify({id:id,status:status?0:1})
}).then(()=>load());
}

load();

</script>
</body>
</html>