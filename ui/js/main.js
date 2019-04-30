	var isVisible = true;
	function navCollapse() {
		// body...
		if (isVisible == true){
            document.getElementById("navigation-menu").style = "display:block; transition: .6s all; width: 100%; height:100%; position:fixed; overflow-y: scroll;";
          isVisible= false;
          }
          else{
            document.getElementById("navigation-menu").style = "display:none; transition: .6s all; ";
          isVisible= true;
          }
	}

	function navCollapseOut(){
		document.getElementById("navigation-menu").style = "display:none; transition: .6s all; ";
          isVisible= true;
	}