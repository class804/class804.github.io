function UnityProgress(unityInstance, progress) {
  if (!unityInstance.Module)
    return;
  if (!unityInstance.progress) {    
	var container = document.getElementById("unityContainer");
	container.style.backgroundColor = "transparent";
  
    unityInstance.progress = document.createElement("div");
	unityInstance.progress.className = "progress";
	unityInstance.progress.id = "progressBar";

    unityInstance.progress.empty = document.createElement("div");
    unityInstance.progress.empty.className = "empty";
    unityInstance.progress.appendChild(unityInstance.progress.empty);

    unityInstance.progress.full = document.createElement("div");
    unityInstance.progress.full.className = "full";

    unityInstance.progress.appendChild(unityInstance.progress.full);
    unityInstance.container.appendChild(unityInstance.progress);	
	
	$.getScript( "TemplateData/PositionProgress.js");
  }
  
  unityInstance.progress.full.style.width = (100 * progress) + "%";
 
 if (progress == 1)
    unityInstance.progress.style.display = "none";
}