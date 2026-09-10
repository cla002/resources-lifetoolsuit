/*
====================================================
LIFE TOOL SUIT DOWNLOAD SYSTEM
====================================================

EMAIL FLOW:

Visitor clicks resource
        ↓
Email popup opens
        ↓
Visitor enters email
        ↓
Email is sent to Google Apps Script
        ↓
Email is stored in Google Sheet
        ↓
Visitor gets the resource

====================================================
*/


/*
====================================================
GOOGLE APPS SCRIPT URL
====================================================
*/

const EMAIL_ENDPOINT =
    "https://script.google.com/macros/s/AKfycbxl99i8MVgCRWssQ4naRh-zIkszRu0TWwfJe3SdC7UJnfRnGRSgm2Fy0BJ5It5MJQc/exec";


/*
====================================================
YOUR RESOURCES
====================================================

Add all future downloads here.

====================================================
*/

const resources = [

    {
        title: "Stop Being Broke: Financial Reset Planner",

        type: "Financial Planner",

        description:
            "A practical planner to help you reset your finances, organize your money, and create a clearer plan going forward.",

        icon: "₱",

        url:
            "https://drive.google.com/uc?export=download&id=176WgG035SZRvoJfaMcnYjDfUUBbOVub2"

    }

];


/*
====================================================
GET PAGE ELEMENTS
====================================================
*/

const resourceGrid =
    document.getElementById("resourceGrid");

const resourceCount =
    document.getElementById("resourceCount");

const year =
    document.getElementById("year");

const modal =
    document.getElementById("emailModal");

const closeModal =
    document.getElementById("closeModal");

const emailForm =
    document.getElementById("emailForm");

const emailInput =
    document.getElementById("emailInput");

const privacyConsent =
    document.getElementById("privacyConsent");

const submitButton =
    document.getElementById("submitButton");

const formStatus =
    document.getElementById("formStatus");

const resourceName =
    document.getElementById("resourceName");


let selectedResource = null;


/*
====================================================
CURRENT YEAR
====================================================
*/

year.textContent =
    new Date().getFullYear();


/*
====================================================
RESOURCE COUNT
====================================================
*/

resourceCount.textContent =
    resources.length;


/*
====================================================
DISPLAY RESOURCES
====================================================
*/

function displayResources() {

    resourceGrid.innerHTML = "";


    resources.forEach(
        (resource, index) => {

            const card =
                document.createElement("article");


            card.className =
                "resource-card";


            card.innerHTML = `

                <div class="resource-icon">
                    ${resource.icon}
                </div>

                <p class="resource-type">
                    ${resource.type}
                </p>

                <h3>
                    ${resource.title}
                </h3>

                <p class="resource-card-description">
                    ${resource.description}
                </p>

                <button
                    type="button"
                    class="download-button"
                    data-index="${index}"
                >

                    <span>
                        Get the resource
                    </span>

                    <span
                        class="arrow"
                        aria-hidden="true"
                    >
                        →
                    </span>

                </button>

            `;


            resourceGrid.appendChild(card);

        }
    );


    /*
    Add click listeners
    */

    document
        .querySelectorAll(".download-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            button.dataset.index
                        );

                    openEmailModal(index);

                }
            );

        });

}


/*
====================================================
OPEN EMAIL MODAL
====================================================
*/

function openEmailModal(index) {

    selectedResource =
        resources[index];


    resourceName.textContent =
        selectedResource.title;


    emailForm.reset();


    formStatus.textContent =
        "";


    submitButton.disabled =
        false;


    submitButton.textContent =
        "Continue to download";


    modal.classList.add("is-open");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    setTimeout(
        () => emailInput.focus(),
        100
    );

}


/*
====================================================
CLOSE EMAIL MODAL
====================================================
*/

function closeEmailModal() {

    modal.classList.remove("is-open");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    selectedResource =
        null;


    formStatus.textContent =
        "";

}


/*
====================================================
CLOSE BUTTON
====================================================
*/

closeModal.addEventListener(
    "click",
    closeEmailModal
);


/*
====================================================
CLICK OUTSIDE MODAL
====================================================
*/

modal.addEventListener(
    "click",
    event => {

        if (
            event.target === modal
        ) {

            closeEmailModal();

        }

    }
);


/*
====================================================
ESCAPE KEY
====================================================
*/

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            modal.classList.contains("is-open")
        ) {

            closeEmailModal();

        }

    }
);


/*
====================================================
SUBMIT EMAIL
====================================================
*/

emailForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        /*
        Validate email.
        */

        if (
            !emailInput.checkValidity()
        ) {

            emailInput.reportValidity();

            return;

        }


        /*
        Validate consent.
        */

        if (
            !privacyConsent.checked
        ) {

            formStatus.textContent =
                "Please check the box above to continue.";

            return;

        }


        /*
        Make sure a resource exists.
        */

        if (
            !selectedResource
        ) {

            return;

        }


        /*
        Make sure Google Apps Script
        has been connected.
        */

        if (
            EMAIL_ENDPOINT.includes(
                "PASTE_YOUR"
            )
        ) {

            formStatus.textContent =
                "The email collection system still needs to be connected.";

            return;

        }


        /*
        Disable button.
        */

        submitButton.disabled =
            true;

        submitButton.textContent =
            "Please wait...";


        formStatus.textContent =
            "";


        try {

            /*
            Send the email to Google Apps Script.

            no-cors is used because Google Apps Script
            does not provide normal browser CORS handling.
            */

            await fetch(
                EMAIL_ENDPOINT,
                {

                    method: "POST",

                    mode: "no-cors",

                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded"
                    },

                    body:
                        new URLSearchParams({

                            email:
                                emailInput.value.trim(),

                            resource:
                                selectedResource.title

                        })

                }
            );


            /*
            Give Google Apps Script a moment
            to receive the request before
            opening the resource.
            */

            setTimeout(
                () => {

                    /*
                    Open the actual Google Drive
                    download URL.
                    */

                    window.open(
                        selectedResource.url,
                        "_blank"
                    );


                    /*
                    Close the email popup.
                    */

                    closeEmailModal();

                },
                500
            );


        } catch (error) {

            console.error(error);


            formStatus.textContent =
                "Something went wrong. Please try again.";


            submitButton.disabled =
                false;


            submitButton.textContent =
                "Continue to download";

        }

    }
);


/*
====================================================
START WEBSITE
====================================================
*/

displayResources();