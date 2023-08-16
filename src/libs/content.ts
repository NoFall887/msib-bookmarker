type Data = {
    [key: string]: string;
    href: string;
    programName: string;
    companyName: string;
    companyLogo: string;
    city: string;
};

// Get the root element
const targetNode = document.querySelector("#root")!;

// check duplicate data function
function isDuplicate(dataToCheck: Data, dataList: Data[]) {
    return dataList.some((data) => {
        return data.href === dataToCheck.href;
    });
}

// save data function
async function saveData(type: string | "magang" | "studi independen", data: Data) {
    let dataToSave: Data[] = [];
    const existsLocalStorage: { [key: string]: Data[] } = await chrome.storage.local.get([
        type,
    ]);
    console.log(existsLocalStorage);
    // if there's saved data
    if (existsLocalStorage[type]) {
        dataToSave = existsLocalStorage[type];
    }

    // check duplicate data

    if (isDuplicate(data, dataToSave)) return;
    dataToSave.push(data);
    await chrome.storage.local.set({ [type]: dataToSave });
}

// create button function
function createButton(listItem: Node) {
    // button styling
    const style = document.createElement("style");
    const css = `
    .add-btn-container {
      display: flex;
      justify-content: center;
      position: absolute;
      bottom: 8px;
      right: 8px;
    }
    .add-btn {
      border: none;
      border-radius: 4px;
      padding: 6px 12px;
      cursor: pointer;
      color: white;
      background-color: #2adb27;
      font-weight: bold
    }
    .add-btn:hover {
      background-color: #08a813
    }
    `;
    style.innerHTML += css;
    // create button and button container element
    const btnContainer = document.createElement("div");
    btnContainer.classList.add("add-btn-container");

    const button = document.createElement("button");
    button.classList.add("add-btn");

    const buttonText = document.createElement("span");
    buttonText.innerText = "Simpan";

    // append created elements to the DOM
    button.appendChild(buttonText);
    btnContainer.appendChild(button);
    document.querySelector("head")?.appendChild(style);
    listItem.appendChild(btnContainer);

    // Add event listener to the button
    button.addEventListener("click", async (event) => {
        // prevent event bubling to parent element
        event.stopPropagation();
        // Extract the information inside the element

        // text information container
        const informationContainer = (listItem as HTMLElement).querySelector(
            ":scope>div:nth-child(2)"
        )! as HTMLElement;

        const linkElement: HTMLLinkElement = informationContainer.querySelector(
            ":scope>p:nth-child(1)>a"
        )!;
        const companyNameElement = informationContainer.querySelector(
            ":scope>p:nth-child(3)"
        );
        const companyName = companyNameElement!.childNodes[0].nodeValue!;
        const city = (companyNameElement?.childNodes[2] as HTMLElement).innerText;
        const companyLogo = (
            (listItem as HTMLElement).querySelector(":scope img") as HTMLImageElement
        ).src;

        const information = {
            // trim href protocol eg. http, https
            href: linkElement.href,
            programName: linkElement.innerText,
            companyName,
            companyLogo,
            city,
        };

        // get type (Magang / SIB)
        const type = document
            .querySelector("p.text-0-0-26.sans-0-0-40.heading-2-0-0-50")!
            .innerHTML.toLowerCase();

        saveData(type, information);
    });
}

// initialize plugin, observe change on root node
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.addedNodes && mutation.addedNodes.length) {
            for (const node of mutation.addedNodes) {
                const element = node as HTMLElement;
                // if element is list container it's child should be list items
                // add observer to list container after it's been rendered
                if (
                    node.nodeType === 1 &&
                    [...element.classList].some((className) =>
                        className.includes("shadow")
                    )
                ) {
                    createButton(node);
                }
            }
        }
    }
});

function findLinkElementByUrl(url: string) {
    const itemsImageElement = document.querySelectorAll(".image-0-0-1399");

    const items: HTMLDivElement[] = Array.from(itemsImageElement).map((image) => {
        return image.closest(".shadow-0-0-1435")!;
    });

    for (const item of items) {
        const itemUrl = (item.querySelector(":scope p:nth-child(1)>a") as HTMLLinkElement)
            .href;
        if (itemUrl === url) {
            return item;
        }
    }

    return false;
}

// Listen for messages from the extension's popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Check if the message is of the correct format (contains a URL)

    if (message.url) {
        // Find the corresponding link element in the webpage's DOM
        const linkElement = findLinkElementByUrl(message.url);

        // Trigger a click event on the link element
        if (linkElement) {
            linkElement.click();
            return;
        }

        sendResponse({ message: false });
    }
});

const config = { childList: true, subtree: true };
observer.observe(targetNode, config);
