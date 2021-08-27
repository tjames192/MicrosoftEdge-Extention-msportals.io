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

    console.log(object);

    // display html logic here
    let mainContainer = document.getElementById('set');

    //console.log(mainContainer);

    // print groupNames
    for (let i = 0; i < object.length; i++) {
        // create div container foreach groupName
        let div_c_groupName = document.createElement("div");
        div_c_groupName.setAttribute("data-role", "collapsible");
        div_c_groupName.setAttribute("data-mini", "true");
        div_c_groupName.setAttribute("data-icon", "false");
        //div_c_groupName.setAttribute(
        mainContainer.append(div_c_groupName);

        // create header foreach groupName
        let h_groupName = document.createElement("h2");
        h_groupName.innerHTML = object[i].groupName;

        // attach header foreach div container
        div_c_groupName.appendChild(h_groupName);

        // create list groupName container
        let ul_portalname = document.createElement("ul");
        ul_portalname.setAttribute("data-role", "listview");
        ul_portalname.setAttribute("data-inset", "true");
        ul_portalname.setAttribute("data-shadow", "false");
        ul_portalname.setAttribute("data-mini", "true");
        ul_portalname.setAttribute("data-icon", "false");
        div_c_groupName.appendChild(ul_portalname);

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

            // create list item and append portalName and links
            let li_portalname = document.createElement("li");
            li_portalname.setAttribute("data-role", "collapsible");
            li_portalname.setAttribute("data-iconpos", "left");
            li_portalname.setAttribute("data-inset", "false");
            li_portalname.setAttribute("data-theme", "b");
            li_portalname.setAttribute("data-icon", "false");
            ul_portalname.appendChild(li_portalname);



            // print portalName
            let h_portalName = document.createElement("h3");
            h_portalName.innerHTML = portalName + ' ' + note;
            li_portalname.appendChild(h_portalName);

            // create list URL container
            let ul_linkcontainer = document.createElement("ul");
            ul_linkcontainer.setAttribute("data-role", "listview");
            ul_linkcontainer.setAttribute("data-theme", "a");
            li_portalname.appendChild(ul_linkcontainer);

            // create list item and append to URL container
            let li = document.createElement('li');
            li.setAttribute("data-icon", "false");
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
                    li.setAttribute("data-icon", "false");
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
            $("[data-role=listview]").listview().listview('refresh');
        }
    }
    $("[data-role=collapsibleset]").collapsibleset("refresh");
}

displayhtml();
