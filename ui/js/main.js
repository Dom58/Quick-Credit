	var isVisible = true;
	function navCollapse() {
		// body...
		if (isVisible == true){
            document.getElementById("navigation-menu").style = "display:block; transition: .6s ease-in-out; width: 100%; height:100%; position:fixed; overflow-y: scroll;";
          isVisible= false;
          }
          else{
            document.getElementById("navigation-menu").style = "display:none; transition: .6s ease-in-out; ";
          isVisible= true;
          }
	}

	function navCollapseOut(){
		document.getElementById("navigation-menu").style = "display:none; transition: .6s ease-in-out; ";
          isVisible= true;
	}

	// Dashboard Left navigation collapsed in out script
	var isCollapsed = true;
	
	function leftSectionCollapse(){

		const leftNavBar = document.getElementById('leftSideDashboard');
	    const rightSideContent = document.getElementById('rightSideDashboard');

		leftNavBar.style.width = !isCollapsed ? '25%' : '0';
		rightSideContent.style.marginLeft = !isCollapsed ? '25%' : '0';
		rightSideContent.style.transition = 'margin-left .4s ease-in-out';
		isCollapsed = !isCollapsed;
	}

	// dummy admin email
	function loginDemoFunction() {

        const dummyAdminEmail = 'admin@gmail.com';
        var inputEmail = document.getElementById('email').value;
        var password = document.getElementById('password').value;
       
       	if((inputEmail == dummyAdminEmail) && password !="" ){

        	window.location.href = "admin-dashboard.html";
       	}

       	else if(inputEmail && password !="") {

        	window.location.href = "welcome-page.html";
       	}

       	else{

         	document.getElementById('email').style="border: 1px solid red;";
         	document.getElementById('password').style="border: 1px solid red;";
         	document.getElementById('message').innerHTML="Error: Login Field(s) are required!";
       	}
        }