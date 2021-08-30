let urls = [
    'https://raw.githubusercontent.com/adamfowlerit/msportals.io/master/_data/portals/admin.json',
    'https://raw.githubusercontent.com/adamfowlerit/msportals.io/master/_data/portals/user.json',
    'https://raw.githubusercontent.com/adamfowlerit/msportals.io/master/_data/portals/thirdparty.json'
];

/*
Promise.all(
	urls.map(url =>
  	fetch(url)
    	.then(e => e.json())
	)
)
.then(data => {
	finalResult = data.flat();
	console.log('what is this result');
  console.log(finalResult);
  console.log('hopefully 1 array');
  //document.write(finalResult);
});
*/

async function getJson(url) {
    let response = await fetch(url);
    let content = await response.json();

    return content;
}

async function displayhtml() {
    let jsons = [];

    for (const url of urls) {
        jsons.push(getJson(url));
    }

    let object = await Promise.all(jsons);
    object = object.flat();

    // display html logic here
    printHTML(object);
}

function printHTML(object) {
	let mainContainer = document.getElementById('set');

    // print groupNames
    for (let i = 0; i < object.length; i++) {
        // foreach groupName create details
        let div_c_groupName = document.createElement("details");
		div_c_groupName.setAttribute('class','portal-group');
        mainContainer.append(div_c_groupName);

        // foreach groupName create summary
        let h_groupName = document.createElement("summary");
        h_groupName.innerHTML = object[i].groupName;

        // attach groupName to summary tag
        div_c_groupName.appendChild(h_groupName);

        // print portalNames
        const portals = object[i].portals;
        for (let z = 0; z < portals.length; z++) {
            // JS object destructuring - https://dmitripavlutin.com/javascript-object-destructuring/
            // print a default value for 'undefined' properties of an object.
            // https://dmitripavlutin.com/7-tips-to-handle-undefined-in-javascript/
            const {
                portalName,
                primaryURL,
                note = ''
            } = portals[z];
			
			// foreach portalName create details
			let details_portalname = document.createElement("details");
			details_portalname.setAttribute('class','portal');
			div_c_groupName.appendChild(details_portalname);
			
            // foreach portalName create summary
            let li_portalname = document.createElement("summary");
			li_portalname.innerHTML = portalName + ' ' + note;
            details_portalname.appendChild(li_portalname);
			
			// create URL container
			let ul_linkcontainer = document.createElement("ul");
			details_portalname.appendChild(ul_linkcontainer);
			
			// create list item and append to URL container
            let li = document.createElement('li');
            ul_linkcontainer.appendChild(li);

            // create link and append to list item
            let link = document.createElement('a');
			link.setAttribute("target", "_blank");
			link.setAttribute("rel", "noopener noreferrer");
            li.appendChild(link);

            // set link as primaryURL
            link.href = primaryURL;
            link.innerText = primaryURL;

            // print portal secondaryURLs if any
            if (portals[z].secondaryURLs) {
                const secondaryURLs = portals[z].secondaryURLs;
                for (let y = 0; y < secondaryURLs.length; y++) {
                    // create list item and append to URL container
                    let li = document.createElement('li');
                    ul_linkcontainer.appendChild(li);

                    // create link and append to list item
                    let link = document.createElement('a');
					link.setAttribute("target", "_blank");
					link.setAttribute("rel", "noopener noreferrer");
                    li.appendChild(link);

                    // set link as secondarURL
                    link.href = secondaryURLs[y].url
                    link.innerText = secondaryURLs[y].url
                }
            }
        }
    }
}

displayhtml();