


const scriptsInEvents = {

	async E_sys_Event11_Act1(runtime, localVars)
	{
		function setToStorage(name, val) {
		    try {
		        localStorage.setItem(name, val);
		    } catch (e) {}
		}
		setToStorage("GameSave", runtime.globalVars.Saved);
	},

	async E_loading_Event10_Act1(runtime, localVars)
	{
		function getFromStorage(name) {
		    try {
		        let val = localStorage.getItem(name);
		        return val;
		    } catch (e) {}
		}
		
		runtime.globalVars.Saved = getFromStorage("GameSave");
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;

