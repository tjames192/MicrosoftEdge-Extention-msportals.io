"use strict";

console.clear();

// make sure file is loaded before use
async function getJson(url) {
    const response = await fetch(url);
    const content = await response.json();

    return content;
}

// combine async functions in a nice promise pattern
async function displayhtml() {
    const urls = [
        'https://raw.githubusercontent.com/adamfowlerit/msportals.io/master/_data/portals/admin.json',
        'https://raw.githubusercontent.com/adamfowlerit/msportals.io/master/_data/portals/user.json',
        'https://raw.githubusercontent.com/adamfowlerit/msportals.io/master/_data/portals/thirdparty.json'
    ];
    
    
    let jsons = [];

    for (const url of urls) {
        const data = getJson(url);
        jsons.push(data);
    }
    
    return (await Promise.all(jsons)).flat();
}

function printHTML(object) {
    const mainContainer = document.getElementById('set');
    
    for (const msportals of object) {
        //console.log(msportals);
        let portalGroup = document.createElement("details");
        portalGroup.setAttribute('class','portal-group');
        mainContainer.append(portalGroup);
        
        let groupName = document.createElement("summary");
        groupName.innerHTML = msportals.groupName;
        portalGroup.appendChild(groupName);
        
        for (const portals of msportals.portals) {
            //console.log(portals);
            let portal = document.createElement("details");
            portal.setAttribute('class','portal');
            portalGroup.appendChild(portal);
            
            let portalName = document.createElement("summary");
            const strPortalNote = portals.note ? ' ' + portals.note : '';
            portalName.innerHTML = portals.portalName + strPortalNote;
            portal.appendChild(portalName);
            
            let linkcontainer = document.createElement("ul");
            portal.appendChild(linkcontainer);
            
            let listItem = document.createElement('li')
            linkcontainer.appendChild(listItem);
            
            let link = document.createElement('a');
            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noopener noreferrer");
            // set link as primaryURL
            link.href = portals.primaryURL;
            link.innerText = portals.primaryURL;
            listItem.appendChild(link);
            
            // print portal secondaryURLs if any
            if (portals.secondaryURLs) {
                for (const secondaryURL of portals.secondaryURLs) {
                    let listItem = document.createElement('li');
                    linkcontainer.appendChild(listItem);
                    
                    let link = document.createElement('a');
                    link.setAttribute("target", "_blank");
                    link.setAttribute("rel", "noopener noreferrer");
                    // set link as secondaryURL
                    link.href = secondaryURL.url;
                    link.innerText = secondaryURL.url;
                    
                    listItem.appendChild(link);
                }
            }
        }
    }
}

const loadingEl = document.querySelector('.loading');
displayhtml()
    .then((msportals) => {
        loadingEl.style.display = 'none';
        printHTML(msportals);
    })
    .catch(error => { 
        console.error('Failed to get json data from URLs');
        loadingEl.style.display = 'none';
    });
