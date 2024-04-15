

/////////// ************

// The add toaster feature goes as follows, 
// I add a "toasters" key in initialState, and I initialize it as an array, then I verify the images input in the
// "LOAD_IMAGES" action. if the verifications don't pass, the function adds a new element
// to the "toasters" array. The element is an object, that contains {element: JSX, textObj: {color: "", body: ""}}
// the main function checks if "toasters" array has elements or has new elements, then it renders those elements by
// calling the "element" key as a function, and giving it "textObj" key as props and arguments. PRETTY NEAT! 


/////////// ***********

import Toaster from "../../components/toaster/Toaster2"

const successText = {
    color: "success",
    header: "Başarılı",
    body: "Başvurunuz gönderilmiştir"
}

const errorText = {
    color: "danger",
    header: "HATA",
    body: "Bir hata olmuştur, lütfen daha sonra tekrar deneyin"
}

export const initialState = {
    selectedService: 0,
    selectedOffer: 0,
    clientDescription: "",
    clientName: "",
    applicationImages: [],
    applicationImagesObjUrls: [],

    isServiceSelected: false,
    isOfferSelected: false,
    isDescriptionInputted: false,
    isClientNameInputted: false,
    areImagesInputted: false,

    areImagesNot3: false,
    areImagesDifferentFormat: false,
    modalTextObj: {
        color: "",
        header: "",
        body: ""
    },
    toasters: []
}

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_SERVICE":
            const serviceID = Number(action.payload)
            let isServiceSelected = false
            if (serviceID !== 0)
                isServiceSelected = true
            else
                isServiceSelected = false
            return {
                ...state,
                selectedService: serviceID,
                isServiceSelected
            }
        
        case "SET_OFFER":
            const offerID = Number(action.payload)
            let isOfferSelected = false
            if (offerID)
                isOfferSelected = true
            else
                isOfferSelected = false
            return {
                ...state,
                selectedOffer: offerID,
                isOfferSelected
            }
        
        case "SET_CLIENT_NAME":
            const clientName = action.payload
            let isClientNameInputted = false
            if (clientName.trim() === "")
                isClientNameInputted = false
            else
                isClientNameInputted = true
            return {
                ...state,
                clientName,
                isClientNameInputted
            }
        
        case "SET_CLIENT_DESCRIPTION":
            const clientDescription = action.payload
            let isDescriptionInputted = false
            if (clientDescription.trim() === "")
                isDescriptionInputted = false
            else
                isDescriptionInputted = true
            return {
                ...state,
                clientDescription,
                isDescriptionInputted
            }
        case "LOAD_IMAGES":
            const images = action.payload
            if (images) {
                // display error toaster if images total is not 3
                if (images.length !== 3) {
                    console.log('images are not 3')
                    const toasterTextObj = {
                        color: "warning",
                        body: "Lütfen 3 adet resim seçiniz"
                    }
                    return {
                        ...state,
                        areImagesNot3: true,
                        applicationImages: [],
                        applicationImagesObjUrls: [],
                        areImagesInputted: false,
                        toasters: [...state.toasters, {element: Toaster, textObj: toasterTextObj}]
                    }
                }

                let objURLS = []
                // loop through the images and store image object as temp url in objURLS array
                for (let i = 0; i < images.length; i++) {
                    // display error toaster if image is not pdf or jpg
                    if (images[i].type.indexOf("image") !== 0) {
                        console.log('images are a different format')
                        const toasterTextObj = {
                            color: "warning",
                            body: "Lütfen seçeceğiniz dosyaları resim olduğundan emin olun"
                        }
                        return {
                            ...state,
                            areImagesDifferentFormat: true,
                            applicationImages: [],
                            applicationImagesObjUrls: [],
                            areImagesInputted: false,
                            toasters: [...state.toasters, {element: Toaster, textObj: toasterTextObj}]
                        }
                    }

                    const objURL = URL.createObjectURL(images[i])
                    objURLS.push(objURL)
                }
                return {
                    ...state,
                    applicationImages: images,
                    applicationImagesObjUrls: objURLS,
                    areImagesNot3: false,
                    areImagesDifferentFormat: false,
                    areImagesInputted: true
                }
            }
            break
        case "SET_MODAL_TEXT_SUCCESS":
            return {
                ...state,
                modalTextObj: successText
            }
        case "SET_MODAL_TEXT_FAILURE":
            const textObj = errorText
            if (action.payload && action.payload.text) {
                textObj.body = action.payload.text
            }
            return {
                ...state,
                modalTextObj: textObj
            }
        
        case "RESET_INPUT":
            return initialState
        default:
            return state
    }
}