function getVersion() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('vers')
}

/**
 * Returns the configuration object from downloads_config.js, according to the passed version
 * @param {string} version 
 * @returns JS object 
 */
function getConfigObj(version) {
    return downloads_config.find(obj => {
        return obj.name === version
    })
}

function getLatestVersion() {
    return downloads_config[0].name;
}

/**
 * Sets the text of the dropdown button to the targetted version
 * @param {string} version The targetted OpenRocket version
 */
function selectDropdownVersion(version) {
    let dropbtn = document.getElementById('dropbtn');
    dropbtn.innerHTML = `${version}<i class="fa-solid fa-angle-down" style="margin-left: 15px;"></i>`
}

/**
 * Fills the download content of a specific OS
 * @param {string} version The targetted OpenRocket version
 * @param {JS object} configObj The configuration object for the targetted version
 * @param {string} OSName The OS to target
 */
function fillOSContent(version, configObj, OSName) {
    let content = document.getElementById(`content-${OSName}`);
    let btn = content.getElementsByTagName('a')[0];
    let instr = document.getElementById(`instructions-${OSName}`);

    // Hide this OS element if there is no information about it in the configObj
    if (!(configObj.hasOwnProperty(`${OSName}File`) && configObj.hasOwnProperty(`${OSName}Instr`))) {
        content.style.display = 'none';
        return;
    }

    // Update the download button content
    const OSFile = configObj[`${OSName}File`];
    btn.href = `https://github.com/openrocket/openrocket/releases/download/release-${version}/${OSFile}`;
    btn.innerHTML = `Download ${OSFile}`;

    // Add the instructions
    const OSInstr = configObj[`${OSName}Instr`];
    let instrContent = document.createElement('zero-md');
    instrContent.src = OSInstr;

    //// Format the element using the main css
    let template = document.createElement('template');
    let link = document.createElement('link');
    link.rel = 'stylsheet';
    link.href = 'main.css'
    template.append(link);
    instrContent.append(template);

    instr.append(instrContent);
}

/**
 * Fills in the necessary information in the source code buttons
 * @param {string} version The targetted OpenRocket version
 * @param {string} format The source code format ('zip' or 'tar.gz')
 */
function fillSourceCode(version, format) {
    let elem = document.getElementById(`source-${format}`)
    elem.href = `https://github.com/openrocket/openrocket/archive/refs/tags/release-${version}.${format}`;
    elem.innerHTML = `Download release-${version}.${format}`;
}

window.onload = function() {
    const version = getVersion();
    
    if ((typeof version === 'undefined') || ( version == null)) {
        // Redirect to latest version
        window.location.replace(`downloads.html?vers=${getLatestVersion()}`);
    }

    let configObj = getConfigObj(version);

    if ((typeof configObj === 'undefined') || (configObj == null)) {
        var content = document.getElementById('downloads-content');
        content.style.display = 'none';
        selectDropdownVersion('INVALID VERSION');
        return
    }

    selectDropdownVersion(version);

    fillOSContent(version, configObj, 'Windows');
    fillOSContent(version, configObj, 'macOS');
    fillOSContent(version, configObj, 'Linux');
    fillOSContent(version, configObj, 'JAR');

    fillSourceCode(version, 'zip');
    fillSourceCode(version, 'tar.gz');
}

