const settings = {
	GDRIVE_SYNC : "GdriveSync",
	GDRIVE_KEEP_LOGGED_IN : "GdriveKeepLoggedIn"
}
GDRIVE_KEEP_LOGGED_IN_SPAN = "GdriveKeepLoggedInSpan";
SAVE_BTN = "SaveBtn";
ATTRIBUTE_CHECKED = "checked";
ATTRIBUTE_DISABLED = "disabled";

const gdriveSync = localStorage.getItem(settings.GDRIVE_SYNC);
const gdriveKeepLoggedin = localStorage.getItem(settings.GDRIVE_KEEP_LOGGED_IN);
const gdriveCheckbox = document.getElementById(settings.GDRIVE_SYNC);
const gdriveKeepLoggedInCheckbox = document.getElementById(settings.GDRIVE_KEEP_LOGGED_IN);
const saveBtn = document.getElementById(SAVE_BTN);

function initSettings() {
	if(gdriveSync) {
		gdriveCheckbox.setAttribute(ATTRIBUTE_CHECKED, ATTRIBUTE_CHECKED);
	
		if(gdriveKeepLoggedin) {
			toggleGdriveKeepLoggedIn(true, true);
		} else {
			toggleGdriveKeepLoggedIn(true, false);
		}
	}
	
	gdriveCheckbox.addEventListener("click", onClickGdriveSync);
	gdriveKeepLoggedInCheckbox.addEventListener("click", onClickGdriveKeepLoggedIn);
	saveBtn.addEventListener("click", onClickSave);
	
	var sideNavs = document.querySelectorAll('.sidenav');
	M.Sidenav.init(sideNavs, {});
}

function toggleGdriveKeepLoggedIn(enable, set) {
	const gdriveKeepLoggedInSpan = document.getElementById(GDRIVE_KEEP_LOGGED_IN_SPAN);
	if(enable) {
		gdriveKeepLoggedInCheckbox.removeAttribute(ATTRIBUTE_DISABLED);
		gdriveKeepLoggedInSpan.style.color="black";
	} else {
		gdriveKeepLoggedInCheckbox.setAttribute(ATTRIBUTE_DISABLED, ATTRIBUTE_DISABLED);
		gdriveKeepLoggedInSpan.style.color="gray";
	}

	if(set) {
		gdriveKeepLoggedInCheckbox.setAttribute(ATTRIBUTE_CHECKED, ATTRIBUTE_CHECKED);
	} else {
		gdriveKeepLoggedInCheckbox.removeAttribute(ATTRIBUTE_CHECKED, ATTRIBUTE_CHECKED);
	}
}

function onClickGdriveSync() {
	const gdriveChecked = gdriveCheckbox.getAttribute(ATTRIBUTE_CHECKED);
	const gdriveKeepLoggedInChecked = gdriveKeepLoggedInCheckbox.getAttribute(ATTRIBUTE_CHECKED);
	if(gdriveChecked === ATTRIBUTE_CHECKED) {
		gdriveCheckbox.removeAttribute(ATTRIBUTE_CHECKED);

		if(gdriveKeepLoggedInChecked) {
			gdriveKeepLoggedInCheckbox.click();
		}
		toggleGdriveKeepLoggedIn(false, false);
	} else {
		gdriveCheckbox.setAttribute(ATTRIBUTE_CHECKED, ATTRIBUTE_CHECKED);
		toggleGdriveKeepLoggedIn(true, false);
	}
}

function onClickGdriveKeepLoggedIn() {
	const gdriveKeepLoggedInChecked = gdriveKeepLoggedInCheckbox.getAttribute(ATTRIBUTE_CHECKED);
	if(gdriveKeepLoggedInChecked === ATTRIBUTE_CHECKED) {
		toggleGdriveKeepLoggedIn(true, false);
	} else {
		toggleGdriveKeepLoggedIn(true, true);
	}
}

function onClickSave() {
	const gdriveChecked = gdriveCheckbox.getAttribute(ATTRIBUTE_CHECKED);
	const gdriveKeepLoggedInChecked = gdriveKeepLoggedInCheckbox.getAttribute(ATTRIBUTE_CHECKED);
	
	if(gdriveChecked)
		localStorage.setItem(settings.GDRIVE_SYNC, true);
	else 
		localStorage.removeItem(settings.GDRIVE_SYNC);

	if(gdriveKeepLoggedInChecked)
		localStorage.setItem(settings.GDRIVE_KEEP_LOGGED_IN, true);
	else
		localStorage.removeItem(settings.GDRIVE_KEEP_LOGGED_IN);

	M.toast({html: 'Saved!', classes: 'rounded'});
}

if(gdriveSync) {
	var head = document.getElementsByTagName('head')[0];

	var script = document.createElement('script');
	script.src = "/static/modules/gdrive.mjs";
	script.type="module";
	//script.type = 'text/javascript';

	head.appendChild(script)
}