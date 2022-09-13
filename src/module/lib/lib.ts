// =============================
// Module Generic function
// =============================

import CONSTANTS from "../constants";
import { Code } from "../small-world-code";
import { SmallWorldDialog } from "../small-world-dialog";



// ================================
// Logger utility
// ================================

// export let debugEnabled = 0;
// 0 = none, warnings = 1, debug = 2, all = 3

export function debug(msg, args = "") {
	if (game.settings.get(CONSTANTS.MODULE_NAME, "debug")) {
		console.log(`DEBUG | ${CONSTANTS.MODULE_NAME} | ${msg}`, args);
	}
	return msg;
}

export function log(message) {
	message = `${CONSTANTS.MODULE_NAME} | ${message}`;
	console.log(message.replace("<br>", "\n"));
	return message;
}

export function notify(message) {
	message = `${CONSTANTS.MODULE_NAME} | ${message}`;
	ui.notifications?.notify(message);
	console.log(message.replace("<br>", "\n"));
	return message;
}

export function info(info, notify = false) {
	info = `${CONSTANTS.MODULE_NAME} | ${info}`;
	if (notify) ui.notifications?.info(info);
	console.log(info.replace("<br>", "\n"));
	return info;
}

export function warn(warning, notify = false) {
	warning = `${CONSTANTS.MODULE_NAME} | ${warning}`;
	if (notify) ui.notifications?.warn(warning);
	console.warn(warning.replace("<br>", "\n"));
	return warning;
}

export function error(error, notify = true) {
	error = `${CONSTANTS.MODULE_NAME} | ${error}`;
	if (notify) ui.notifications?.error(error);
	return new Error(error.replace("<br>", "\n"));
}

export function timelog(message): void {
	warn(Date.now(), message);
}

export const i18n = (key: string): string => {
	return game.i18n.localize(key)?.trim();
};

export const i18nFormat = (key: string, data = {}): string => {
	return game.i18n.format(key, data)?.trim();
};

// export const setDebugLevel = (debugText: string): void => {
//   debugEnabled = { none: 0, warn: 1, debug: 2, all: 3 }[debugText] || 0;
//   // 0 = none, warnings = 1, debug = 2, all = 3
//   if (debugEnabled >= 3) CONFIG.debug.hooks = true;
// };

export function dialogWarning(message, icon = "fas fa-exclamation-triangle") {
	return `<p class="${CONSTANTS.MODULE_NAME}-dialog">
        <i style="font-size:3rem;" class="${icon}"></i><br><br>
        <strong style="font-size:1.2rem;">${CONSTANTS.MODULE_NAME}</strong>
        <br><br>${message}
    </p>`;
}

// =========================================================================================

export function cleanUpString(stringToCleanUp: string) {
	// regex expression to match all non-alphanumeric characters in string
	const regex = /[^A-Za-z0-9]/g;
	if (stringToCleanUp) {
		return i18n(stringToCleanUp).replace(regex, "").toLowerCase();
	} else {
		return stringToCleanUp;
	}
}

export function isStringEquals(stringToCheck1: string, stringToCheck2: string, startsWith = false): boolean {
	if (stringToCheck1 && stringToCheck2) {
		const s1 = cleanUpString(stringToCheck1) ?? "";
		const s2 = cleanUpString(stringToCheck2) ?? "";
		if (startsWith) {
			return s1.startsWith(s2) || s2.startsWith(s1);
		} else {
			return s1 === s2;
		}
	} else {
		return stringToCheck1 === stringToCheck2;
	}
}

/**
 * The duplicate function of foundry keep converting my string value to "0"
 * i don't know why this methos is a brute force solution for avoid that problem
 */
export function duplicateExtended(obj: any): any {
	try {
		//@ts-ignore
		if (structuredClone) {
			//@ts-ignore
			return structuredClone(obj);
		} else {
			// Shallow copy
			// const newObject = jQuery.extend({}, oldObject);
			// Deep copy
			// const newObject = jQuery.extend(true, {}, oldObject);
			return jQuery.extend(true, {}, obj);
		}
	} catch (e) {
		return duplicate(obj);
	}
}

// =========================================================================================

// =============================
// Module SPECIFIC function
// =============================

export const ORIGINAL_FONT_LIST:{name:string; key:string;}[] = [
    {name: "Voynich", key: "small-world-font-Voynich"},
    {name: "Madrona", key: "small-world-font-Madrona"},
    {name: "Evoken", key: "small-world-font-Evoken"},
    {name: "Gavelk", key: "small-world-font-Gavelk"},
    {name: "OldGavelk", key: "small-world-font-OldGavelk"},
    {name: "Divinish", key: "small-world-font-Divinish"},
    {name: "Grasstext", key: "small-world-font-Grasstext"},
    {name: "Reptilian", key: "small-world-font-Reptilian"},
    {name: "Kushudian", key: "small-world-font-Kushudian"},
    {name: "thaumatology", key: "small-world-font-thaumatology"},
    {name: "UltraCode", key: "small-world-font-UltraCode"},
    {name: "RlyehRunes", key: "small-world-font-RlyehRunes"}
]

export async function getTranslatablelist(deepl, ms, option){
    let dlresult = false;
    let msresult = false;
    let gmtrans =  <boolean>await game.settings.get(CONSTANTS.MODULE_NAME, "gmTranslate");
    let gmtable = <any>await game.settings.get(CONSTANTS.MODULE_NAME, "worldtranslateTable");

    if(deepl){
        let code = await game.settings.get(CONSTANTS.MODULE_NAME, "deeplunseenkey");
        let decode = await Code.decode(code);
        let pro = await game.settings.get(CONSTANTS.MODULE_NAME, "deeplpro");
        const API_KEY = decode;
        let url;

        if(pro){
            url = 'https://api.deepl.com/v2/languages';
        }else{
            url = 'https://api-free.deepl.com/v2/languages';
        }
        const DLAPI_URL = url;
        try{
            await $.ajax({
                type:"GET",
                url:DLAPI_URL,
                data:{
                    "auth_key": API_KEY,
                    "type": "target"
                },
                dataType: "json"
            })
            .done(async function(data){
                let list = <any>await game.settings.get(CONSTANTS.MODULE_NAME, "translateTable");
                list.deepl = data;
                dlresult = true;
                await game.settings.set(CONSTANTS.MODULE_NAME, "translateTable", list);
            })
            .fail(async function(data){
                if(gmtrans && !!gmtable.deepl){
                    await game.settings.set(CONSTANTS.MODULE_NAME, "translateTable", gmtable);
                }else{
                    console.error(data);
                    console.error(game.i18n.localize("SMALLW.ErrorDeeplApiKey"))
                    let list = <any>await game.settings.get(CONSTANTS.MODULE_NAME, "translateTable");
                    list.deepl = null;
                    await game.settings.set(CONSTANTS.MODULE_NAME, "translateTable", list);
                }
            })
        }catch{}
    }

    if(ms){
        const MSAPI_URL = "https://api.cognitive.microsofttranslator.com/languages?api-version=3.0" + "&scope=translation";
        let userLanguage = await game.settings.get(CONSTANTS.MODULE_NAME, "userLanguage");
        if(userLanguage == "zh") userLanguage = "zh-Hans";
        let detect = await game.settings.get(CONSTANTS.MODULE_NAME, "dontDetectLang");
        if(!userLanguage || detect) userLanguage = "EN"

        try{
            await $.ajax({
                type: "GET",
                url: MSAPI_URL,
                headers:<any>{
                    "Content-Type": "application/json; charset=UTF-8",
                    "Accept-Language": userLanguage
                },
                dataType: "json",
            })
            .done(async function(data){
                let list = <any>await game.settings.get(CONSTANTS.MODULE_NAME, "translateTable");
                list.microsoft = data;
                await game.settings.set(CONSTANTS.MODULE_NAME, "translateTable", list);
            })
            .fail(async function(data){
                if(gmtrans && !!gmtable.microsoft){
                    await game.settings.set(CONSTANTS.MODULE_NAME, "translateTable", gmtable);
                }else{
                    console.error(data);
                    let list = <any>await game.settings.get(CONSTANTS.MODULE_NAME, "translateTable");
                    list.microsoft = null;
                    await game.settings.set(CONSTANTS.MODULE_NAME, "translateTable", list);
                }
            })
        }catch(e){
            error(e);
        }

        try{
            const TEST_URL = "https://api.cognitive.microsofttranslator.com/detect?api-version=3.0";
            let code = game.settings.get(CONSTANTS.MODULE_NAME, "msunseenkey");
            let decode = await Code.decode(code);
            const API_KEY = decode;
            await $.ajax({
                type: "POST",
                url: TEST_URL,
                headers:{
                    "Ocp-Apim-Subscription-Key": API_KEY,
                    "Content-Type": "application/json"
                },
                dataType: "json",
                data: `[{"Text": ""}]`
            })
            .done(async function(data){
                msresult = true;
                await game.settings.set(CONSTANTS.MODULE_NAME, "MsConnectionStatus", true);
            })
            .fail(async function(data){
                console.error(data);
                console.error(game.i18n.localize("SMALLW.ErrorMicrosoftApiKey"))
                let list = <any>await game.settings.get(CONSTANTS.MODULE_NAME, "translateTable");
                if(!gmtrans || !gmtable.microsoft)  {
                    list.microsoft = null;
                    await game.settings.set(CONSTANTS.MODULE_NAME, "translateTable", list);
                }
                await game.settings.set(CONSTANTS.MODULE_NAME, "MsConnectionStatus", false);
            })
        }catch{}
    }

    if(option){
        if(game.user?.isGM){
            let list = <any>await game.settings.get(CONSTANTS.MODULE_NAME, "canTranslateList");
            let index = list.findIndex(i => i.gmid == game.user?.id);
            if(index < 0){
                list.push({gmid: game.user?.id, deepl: dlresult, microsoft: msresult})
            }else{
                if(list[index].deepl != dlresult) list[index].deepl = dlresult;
                if(list[index].microsoft != msresult) list[index].microsoft = msresult;
            }
            await game.settings.set(CONSTANTS.MODULE_NAME, "canTranslateList", list);
            let worldlist = await game.settings.get(CONSTANTS.MODULE_NAME, "worldtranslateTable");
            if(dlresult && msresult){
                worldlist =  await game.settings.get(CONSTANTS.MODULE_NAME, "translateTable");
                game.settings.set(CONSTANTS.MODULE_NAME, "worldtranslateTable", worldlist)
            }
            let dltranslator = list.find(i => i.deepl  && game.users.get(i.gmid).active);
            let mstranslator = list.find(i => i.microsoft  && game.users.get(i.gmid).active);
            if(!dltranslator) {
                worldlist.deepl = null;
                await game.settings.set(CONSTANTS.MODULE_NAME, "worldtranslateTable", worldlist);
            }
            if(!mstranslator) {
                worldlist.microsoft = null;
                await game.settings.set(CONSTANTS.MODULE_NAME, "worldtranslateTable", worldlist)
            }
        }
    }
}

export async function translateType(event){
    event.preventDefault();
    let translatorlist = <any>await game.settings.get(CONSTANTS.MODULE_NAME, "canTranslateList");
    let translator = translatorlist.find(i => (i.deepl) && (i.microsoft) && (game.users?.get(i.gmid)?.active));
    let transType = await game.settings.get(CONSTANTS.MODULE_NAME, "translateType");
    let list = <any>await game.settings.get(CONSTANTS.MODULE_NAME, "translateTable");
    let msStatus = await game.settings.get(CONSTANTS.MODULE_NAME, "MsConnectionStatus");
    let gmtrans = await game.settings.get(CONSTANTS.MODULE_NAME, "gmTranslate");
    if((!msStatus && (!gmtrans || !translator)) && (transType == 1)) {
        transType = 2;
    }
    if((list.deepl == null) && (transType == 0)){
        transType = 1;
    }
    if((list.deepl == null) && (!msStatus && (!gmtrans || !translator)) && (transType != 2)){
        transType = 2;
    }
    $(event.currentTarget).css({
        "display": "none"
    });
    event.currentTarget.parentNode.getElementsByClassName("translate-select")[0].options.length = 0;
    if(transType == 2){
        getOption(0, event.currentTarget.parentNode.getElementsByClassName("translate-select")[0], "")
        $(event.currentTarget).parent("div.translate-buttons").children("a.translate-local").css({
            "display": "inline-block"
        })
    }else if(transType == 1){
        getOption(2, event.currentTarget.parentNode.getElementsByClassName("translate-select")[0], "")
        $(event.currentTarget).parent("div.translate-buttons").children("a.translate-microsoft").css({
            "display": "inline-block",
        });
    }else if(transType == 0){
        getOption(1, event.currentTarget.parentNode.getElementsByClassName("translate-select")[0], "")
        $(event.currentTarget).parent("div.translate-buttons").children("a.translate-deepl").css({
            "display": "inline-block",
        });
    }
    if(transType == 2) {transType = 0}else{transType += 1}
    await game.settings.set(CONSTANTS.MODULE_NAME, "selectedLang", "");
    await game.settings.set(CONSTANTS.MODULE_NAME, "translateType", transType);
}

export async function translateActivate(event){
    event.preventDefault();
    let activate = await game.settings.get(CONSTANTS.MODULE_NAME, "translateActivate");
    if(activate){
        $(event.currentTarget).css({
            "border-left": "",
            "border-right": "",
            "box-shadow": "",
            "background": ""
        })
    }else{
        $(event.currentTarget).css({
            "border-left": "1px solid red",
            "border-right": "1px solid red",
            "box-shadow": "0 0 6px inset #ff6400",
            "background": "radial-gradient(closest-side at 50%, red 1%, transparent 99%)"
        })
    }
    await game.settings.set(CONSTANTS.MODULE_NAME, "translateActivate", !activate)
}

export async function getOption(type, origin, select){
    var defoption = document.createElement("option");
    defoption.value = "";
    var deftext = document.createTextNode(game.i18n.localize("SMALLW.TargetLanguage"));
    defoption.appendChild(deftext);
    if(select == "") defoption.setAttribute("selected", "selected");
    defoption.setAttribute("hidden", "true");
    origin.appendChild(defoption);
    if(type == 0){
        let list = ORIGINAL_FONT_LIST;
        for(let i = 0; i < list.length; i++){
            var option = document.createElement("option");
            option.value = list[i].key;
            var text = document.createTextNode(list[i].name + "(code)");
            option.appendChild(text);
            if(select == list[i].key) option.setAttribute("selected", "selected");
            origin.appendChild(option);
        }
        return origin
    }else if(type == 1){
        let list = <any>await game.settings.get(CONSTANTS.MODULE_NAME, "translateTable");

        for(let i = 0; i < list.deepl.length; i++){
            var option = document.createElement("option");
            option.value = list.deepl[i].language;
            var text = document.createTextNode(list.deepl[i].name + "(deepl)");
            option.appendChild(text);
            if(select == list.deepl[i].language) option.setAttribute("selected", "selected");
            origin.appendChild(option);
        }
        return origin
    }else if(type == 2){
        let list =<any>await game.settings.get(CONSTANTS.MODULE_NAME, "translateTable");

        for(let [key, value] of Object.entries(list.microsoft?.translation)){
            var option = document.createElement("option");
            option.value = key;
            //@ts-ignore
            var text = document.createTextNode(String(value?.name) + "(MS)");
            option.appendChild(text);
            if(select == key) option.setAttribute("selected", "selected");
            origin.appendChild(option);
        }
        return origin
    }
}

export async function translateUserSelect(event){
    event.preventDefault();
    const users = game.users?.contents;
    let bilingal = await game.settings.get(CONSTANTS.MODULE_NAME, "bilingual")
    let send;
    let def = [];
    for(let k = 0; k < users.length; k++){
        def.push({id:users[k].id, name:users[k].name, type:1})
    }
    send = [...def]
    if(!game.user?.data.flags[CONSTANTS.MODULE_NAME]){
        await game.user?.setFlag(CONSTANTS.MODULE_NAME, "select-users", send)
    }else{
        for(let i = 0; i < game.user?.data.flags[CONSTANTS.MODULE_NAME]["select-users"].length; i++){
            let index = send.findIndex(j => (j.id == game.user?.data.flags[CONSTANTS.MODULE_NAME]["select-users"][i].id) && (j.name == game.user?.data.flags[CONSTANTS.MODULE_NAME]["select-users"][i].name));
            if(index >= 0){
                send[index] = {...game.user?.data.flags[CONSTANTS.MODULE_NAME]["select-users"][i]}
            }
        }
        if(!bilingal) send.forEach(k => {if(k.type == 2) k.type = 1});
        await game.user?.setFlag(CONSTANTS.MODULE_NAME, "select-users", send);
    }
    const html = await renderTemplate('modules/small-world/templates/UserSelectDialog.html', {users:game.user?.data.flags[CONSTANTS.MODULE_NAME]["select-users"], bilingal:bilingal});
    const data =  await new Promise(resolve => {
        const dlg = new SmallWorldDialog({
            title: game.i18n.localize("SMALLW.UserTargetLangSelect"),
            content: html,
            buttons:{
                submit:{
                    label: game.i18n.localize("SMALLW.Save"),
                    icon: `<i class="far fa-save"></i>`,
                    callback: async (html) => {
                        formData = new FormData(html[0].querySelector('#select-user-lang'));
                        for(let l = 0; l < send.length; l++){
                            send[l].type = Number(formData.get(send[l].id));
                        }
                        await game.user?.setFlag(CONSTANTS.MODULE_NAME, "select-users", send);
                        return resolve(true)
                    }
                },
                reset:{
                    label: game.i18n.localize("SMALLW.Default"),
                    icon: `<i class="fas fa-undo"></i>`,
                    callback: async () => {
                        await game.user?.setFlag(CONSTANTS.MODULE_NAME, "select-users", def);
                        return resolve(true)
                    }
                }
            },
            default: '',
            close:() => { return resolve(false)}
        });
        dlg.render(true);
    });
}


export async function createTranslation({transType, transLang, chatData, copy, tag, targetlist, text, senddata, count, usersetting, bilingual, secondL, userLanguage, detect, option = false}){
    game.user?.setFlag(CONSTANTS.MODULE_NAME, "translatable", false);
    let bytes = text.join().bytes();
    if(transType == 0){
        let back = await new Promise( async resolve => {
            //First language = original
            let out = await getOriginalFontCode(text);
            let reptrans = "";
            let i = 0;
            for(let j = 0; j < targetlist.length; j++){
                if(targetlist[j].tag) reptrans += targetlist[j].tag;
                if(targetlist[j].text) {
                    if(tag.length == 1) {
                        reptrans += `<span class="${transLang}">` + out[i] + `</span>`;
                    }else{
                        reptrans += `<span class="${transLang}" style="font-size:inherit">` + out[i] + `</span>`;
                    }
                    i +=1;}
            }
            chatData.flags[CONSTANTS.MODULE_NAME] = {active:null, user:usersetting}
            chatData.content = `<div class="small-world-display-default small-world" style="display:none">` + copy.content + `</div>`;
            chatData.content +=  `<div class="small-world-display-first small-world" style="display:none">` + reptrans + `</div>`;

            if(bilingual){
                if(detect) userLanguage = ""
                if(secondL != "default"){
                    if(secondL.match(/^small-world-font-/)){
                        //First language = original, second language = original
                        let out = await getOriginalFontCode(text);
                        let reptrans = "";
                        let i = 0;
                        for(let j = 0; j < targetlist.length; j++){
                            if(targetlist[j].tag) reptrans += targetlist[j].tag;
                            if(targetlist[j].text) {
                                if(tag.length == 1) {
                                    reptrans += `<span class="${secondL}">` + out[i] + `</span>`;
                                }else{
                                    reptrans += `<span class="${secondL}" style="font-size:inherit">` + out[i] + `</span>`;
                                }
                                i +=1;}
                        }
                        chatData.content += `<div class="small-world-display-second small-world" style="display:none">` + reptrans + `</div>`;
                    }else if(secondL.match(/[a-z]/g)){
                        //First language = original, second language = ms
                        var charC = <any>await game.settings.get(CONSTANTS.MODULE_NAME, "translateMsCount");
                        let limit = <number>game.settings.get(CONSTANTS.MODULE_NAME, "mslimit");
                        if(charC.count > limit){
                            if(option){
                                return resolve(false)
                            }else{
                                const dlg = new Dialog({
                                    title: game.i18n.localize("SMALLW.CantBeTrans"),
                                    content: `<p>${game.i18n.localize("SMALLW.MsLimit")}<br>${game.i18n.localize("SMALLW.ErrorWithoutTranslation")}</p><br><br><textarea readonly>${copy.content}</textarea>`,
                                    buttons:{
                                        yes:{
                                            label:game.i18n.localize("SMALLW.Yes"),
                                            icon: `<i class="fas fa-check"></i>`,
                                            callback: () => {
                                                ChatMessage.create(copy);
                                            }
                                        },
                                        no:{
                                            label:game.i18n.localize("SMALLW.No"),
                                            icon: `<i class="fas fa-times"></i>`,
                                            callback: () => {}
                                        }
                                    },
                                    default: '',
                                    close:() => {}
                                });
                                dlg.render(true);
                            }
                        }else if((count > 10000) || (text.length > 999)){
                            if(option){
                                return resolve(false)
                            }else{
                                const dlg = new Dialog({
                                    title: game.i18n.localize("SMALLW.CantBeTrans"),
                                    content: `<p>${game.i18n.localize("SMALLW.MsSingleLimit")}<br>${game.i18n.localize("SMALLW.ErrorWithoutTranslation")}</p><br><br><textarea readonly>${copy.content}</textarea>`,
                                    buttons:{
                                        yes:{
                                            label:game.i18n.localize("SMALLW.Yes"),
                                            icon: `<i class="fas fa-check"></i>`,
                                            callback: () => {
                                                ChatMessage.create(copy);
                                            }
                                        },
                                        no:{
                                            label:game.i18n.localize("SMALLW.No"),
                                            icon: `<i class="fas fa-times"></i>`,
                                            callback: () => {}
                                        }
                                    },
                                    default: '',
                                    close:() => {}
                                });
                                dlg.render(true);
                            }
                        }else{
                            let code2 = game.settings.get(CONSTANTS.MODULE_NAME, "msunseenkey");
                            let decode2 = await Code.decode(code2);
                            const API_KEY2 = decode2;
                            let lang2 = userLanguage;
                            if(lang2 == "zh") lang2 = "zh-Hans"
                            const API_URL2 = "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0" + `&from=${lang2}&to=${secondL}`;

                            await $.when(
                                getMstranslate(senddata, API_KEY2, API_URL2)
                            )
                            .done(async function (result){
                                let reptrans = "";
                                let i = 0;
                                for(let j = 0; j < targetlist.length; j++){
                                    if(targetlist[j].tag) reptrans += targetlist[j].tag;
                                    if(targetlist[j].text) {
                                        if(result[i].translations[0].to == "tlh-Piqd"){
                                            reptrans += `<span class="small-world-font-Piqd">` + result[i].translations[0].text + `</div>`;
                                        }else{
                                            reptrans += result[i].translations[0].text;
                                        }
                                        i +=1;
                                    }
                                }
                                console.log(`Translated:${copy.content} => ${reptrans}`)
                                chatData.content += `<div class="small-world-display-second small-world" style="display:none">` + reptrans + `</div>`;
                                game.settings.set(CONSTANTS.MODULE_NAME, "translateMsCount", {count:charC.count + count,limit: limit});
                                console.log(`Your translated text at Microsoft Translator is ${charC.count + count}/${limit} characters.`)
                            })
                            .fail(async function(result){
                                    if(option){
                                        return resolve(false)
                                    }else{
                                        let title =  game.i18n.localize("SMALLW.CantBeTrans");
                                        let content = `<p>${game.i18n.localize("SMALLW.ErrorTechnicalProblem")}<br>${game.i18n.localize("SMALLW.ErrorWithoutTranslation")}</p><br><br><textarea readonly>${copy.content}</textarea>`;
                                        await failpop(result, chatData =  copy, title, content);
                                    }
                                }
                            )
                        }
                    }else{
                        //First language = original, second language = deepl
                        var charC = <any>await game.settings.get(CONSTANTS.MODULE_NAME, "translateDeeplCount");
                        let limit = <number>await game.settings.get(CONSTANTS.MODULE_NAME, "deepllimit");
                        if(charC.count > limit){
                            if(option){
                                return resolve(false)
                            }else{
                                const dlg = new Dialog({
                                    title: game.i18n.localize("SMALLW.CantBeTrans"),
                                    content: `<p>${game.i18n.localize("SMALLW.ErrorDeeplLimit")}<br>${game.i18n.localize("SMALLW.ErrorWithoutTranslation")}</p><br><br><textarea readonly>${copy.content}</textarea>`,
                                    buttons:{
                                        yes:{
                                            label:game.i18n.localize("SMALLW.Yes"),
                                            icon: `<i class="fas fa-check"></i>`,
                                            callback: () => {
                                                ChatMessage.create(copy);
                                            }
                                        },
                                        no:{
                                            label:game.i18n.localize("SMALLW.No"),
                                            icon: `<i class="fas fa-times"></i>`,
                                            callback: () => {}
                                        }
                                    },
                                    default: '',
                                    close:() => {}
                                });
                                dlg.render(true);
                            }
                        }else if(bytes > 128000 || text.length > 50){
                            if(option){
                                return resolve(false)
                            }else{
                                const dlg = new Dialog({
                                    title: game.i18n.localize("SMALLW.CantBeTrans"),
                                    content: `<p>${game.i18n.localize("SMALLW.ErrorDeeplSingleLimit")}<br>${game.i18n.localize("SMALLW.ErrorWithoutTranslation")}</p><br><br><textarea readonly>${copy.content}</textarea>`,
                                    buttons:{
                                        yes:{
                                            label:game.i18n.localize("SMALLW.Yes"),
                                            icon: `<i class="fas fa-check"></i>`,
                                            callback: () => {
                                                ChatMessage.create(copy);
                                            }
                                        },
                                        no:{
                                            label:game.i18n.localize("SMALLW.No"),
                                            icon: `<i class="fas fa-times"></i>`,
                                            callback: () => {}
                                        }
                                    },
                                    default: '',
                                    close:() => {}
                                });
                                dlg.render(true);
                            }
                        }else{
                            let code = await game.settings.get(CONSTANTS.MODULE_NAME, "deeplunseenkey");
                            let decode = await Code.decode(code);
                            const API_KEY = decode;
                            let pro = await game.settings.get(CONSTANTS.MODULE_NAME, "deeplpro");
                            if(detect) userLanguage = ""
                            let url;
                            if(pro){
                                url = 'https://api.deepl.com/v2/translate';
                            }else{
                                url = 'https://api-free.deepl.com/v2/translate';
                            }
                            const API_URL = url;
                            await $.when(
                                getDeepltranslate(text, API_KEY, API_URL, userLanguage, transLang = secondL)
                            )
                            .done(async function (result){
                                let reptrans = "";
                                let i = 0;
                                for(let j = 0; j < targetlist.length; j++){
                                    if(targetlist[j].tag) {
                                        reptrans += targetlist[j].tag;
                                    }
                                    if(targetlist[j].text) {
                                        reptrans += result.translations[i].text; i +=1;
                                    }
                                }
                                console.log(`Translated:${copy.content} => ${reptrans}`)
                                chatData.content += `<div class="small-world-display-second small-world" style="display:none">` + reptrans + `</div>`;
                                ChatMessage.create(copy);
                                await getDeeplCount();
                                let dlc = <any>await game.settings.get(CONSTANTS.MODULE_NAME, "translateDeeplCount");
                                console.log(`Your translated text at DeepL is ${dlc.count}/${limit} characters.`);
                            })
                            .fail(async function(result){
                                    if(option){
                                        return resolve(false)
                                    }else{
                                        let title =  game.i18n.localize("SMALLW.CantBeTrans");
                                        let content = `<p>${game.i18n.localize("SMALLW.ErrorTechnicalProblem")}<br>${game.i18n.localize("SMALLW.ErrorWithoutTranslation")}</p><br><br><textarea readonly>${copy.content}</textarea>`;
                                        await failpop(result, chatData =  copy, title, content);
                                    }
                                }
                            )
                        }
                    }
                }else{
                    if(option){
                        return resolve(false)
                    }else{
                        chatData = null;
                        const dlg = new Dialog({
                            title: game.i18n.localize("SMALLW.CantBeTrans"),
                            content: `<p>${game.i18n.localize("SMALLW.SecondLanguageDefault")}<br>${game.i18n.localize("SMALLW.ErrorWithoutTranslation")}</p><br><br><textarea readonly>${copy.content}</textarea>`,
                            buttons:{
                                yes:{
                                    label:game.i18n.localize("SMALLW.Yes"),
                                    icon: `<i class="fas fa-check"></i>`,
                                    callback: () => {
                                        ChatMessage.create(copy);
                                    }
                                },
                                no:{
                                    label:game.i18n.localize("SMALLW.No"),
                                    icon: `<i class="fas fa-times"></i>`,
                                    callback: () => {}
                                }
                            },
                            default: '',
                            close:() => {}
                        });
                        dlg.render(true);
                    }
                }
            }
            await ChatMessage.create(chatData);
            return resolve(true)
        })
        game.user?.setFlag(CONSTANTS.MODULE_NAME, "translatable", true);
        return back
    }else if(transType == 1){
        //First language = deepl
        var charC = <any>await game.settings.get(CONSTANTS.MODULE_NAME, "translateDeeplCount");
        let limit = <number>await game.settings.get(CONSTANTS.MODULE_NAME, "deepllimit");
        if(charC.count > limit){
            game.user?.setFlag(CONSTANTS.MODULE_NAME, "translatable", true);
            if(option){
                return false
            }else{
                const dlg = new Dialog({
                    title: game.i18n.localize("SMALLW.CantBeTrans"),
                    content: `<p>${game.i18n.localize("SMALLW.ErrorDeeplLimit")}<br>${game.i18n.localize("SMALLW.ErrorWithoutTranslation")}</p><br><br><textarea readonly>${copy.content}</textarea>`,
                    buttons:{
                        yes:{
                            label:game.i18n.localize("SMALLW.Yes"),
                            icon: `<i class="fas fa-check"></i>`,
                            callback: () => {
                                ChatMessage.create(copy);
                            }
                        },
                        no:{
                            label:game.i18n.localize("SMALLW.No"),
                            icon: `<i class="fas fa-times"></i>`,
                            callback: () => {}
                        }
                    },
                    default: '',
                    close:() => {}
                });
                dlg.render(true);
            }
        }else if(bytes > 128000 || text.length > 50){
            game.user?.setFlag(CONSTANTS.MODULE_NAME, "translatable", true);
            if(option){
                return false
            }else{
                const dlg = new Dialog({
                    title: game.i18n.localize("SMALLW.CantBeTrans"),
                    content: `<p>${game.i18n.localize("SMALLW.ErrorDeeplSingleLimit")}<br>${game.i18n.localize("SMALLW.ErrorWithoutTranslation")}</p><br><br><textarea readonly>${copy.content}</textarea>`,
                    buttons:{
                        yes:{
                            label:game.i18n.localize("SMALLW.Yes"),
                            icon: `<i class="fas fa-check"></i>`,
                            callback: () => {
                                ChatMessage.create(copy);
                            }
                        },
                        no:{
                            label:game.i18n.localize("SMALLW.No"),
                            icon: `<i class="fas fa-times"></i>`,
                            callback: () => {}
                        }
                    },
                    default: '',
                    close:() => {}
                });
                dlg.render(true);
            }
        }else{
            let back = await new Promise( resolve =>{ (async() => {
                let code = await game.settings.get(CONSTANTS.MODULE_NAME, "deeplunseenkey");
                let decode = await Code.decode(code);
                const API_KEY = decode;
                let pro = await game.settings.get(CONSTANTS.MODULE_NAME, "deeplpro");
                if(detect) userLanguage = ""
                let url;
                if(pro){
                    url = 'https://api.deepl.com/v2/translate';
                }else{
                    url = 'https://api-free.deepl.com/v2/translate';
                }
                const API_URL = url;

                $.when(
                    getDeepltranslate(text, API_KEY, API_URL, userLanguage, transLang)
                )
                .done(async function (result){
                    let reptrans = "";
                    let i = 0;
                    for(let j = 0; j < targetlist.length; j++){
                        if(targetlist[j].tag) {
                            reptrans += targetlist[j].tag;
                        }
                        if(targetlist[j].text) {
                            reptrans += result.translations[i].text; i +=1;
                        }
                    }
                    console.log(`Translated:${chatData.content} => ${reptrans}`)
                    chatData.flags[CONSTANTS.MODULE_NAME] = {origin:chatData.content,trans:{transLang:transLang, text: reptrans}, active:null, user:usersetting}
                    chatData.content = `<div class="small-world-display-default small-world" style="display:none">` + copy.content + `</div>`;
                    chatData.content +=  `<div class="small-world-display-first small-world" style="display:none">` + reptrans + `</div>`;
                    await getDeeplCount();
                    let dlc = <any>await game.settings.get(CONSTANTS.MODULE_NAME, "translateDeeplCount");
                    console.log(`Your translated text at DeepL is ${dlc.count}/${limit} characters.`);

                    if(bilingual){
                        if(secondL != "default"){
                            if(secondL.match(/^small-world-font-/)){
                                //First language = deepl, second language = original
                                let out = await getOriginalFontCode(text);
                                let reptrans = "";
                                let i = 0;
                                for(let j = 0; j < targetlist.length; j++){
                                    if(targetlist[j].tag) reptrans += targetlist[j].tag;
                                    if(targetlist[j].text) {
                                        if(tag.length == 1) {
                                            reptrans += `<span class="${secondL}">` + out[i] + `</span>`;
                                        }else{
                                            reptrans += `<span class="${secondL}" style="font-size:inherit">` + out[i] + `</span>`;
                                        }
                                        i +=1;}
                                }
                                chatData.content +=  `<div class="small-world-display-second small-world" style="display:none">` + reptrans + `</div>`;
                            }else if(secondL.match(/[a-z]/g)){
                                //Fist language = deepl, second language = ms
                                var charC2 = <any>await game.settings.get(CONSTANTS.MODULE_NAME, "translateMsCount");
                                let limit2 = <number>await game.settings.get(CONSTANTS.MODULE_NAME, "mslimit");
                                if(charC2.count > limit2){
                                    if(option){
                                        return resolve(false)
                                    }else{
                                        const dlg = new Dialog({
                                            title: game.i18n.localize("SMALLW.CantBeTrans"),
                                            content: `<p>${game.i18n.localize("SMALLW.MsLimit")}<br>${game.i18n.localize("SMALLW.ErrorWithoutTranslation")}</p><br><br><textarea readonly>${copy.content}</textarea>`,
                                            buttons:{
                                                yes:{
                                                    label:game.i18n.localize("SMALLW.Yes"),
                                                    icon: `<i class="fas fa-check"></i>`,
                                                    callback: () => {
                                                        ChatMessage.create(copy);
                                                    }
                                                },
                                                no:{
                                                    label:game.i18n.localize("SMALLW.No"),
                                                    icon: `<i class="fas fa-times"></i>`,
                                                    callback: () => {}
                                                }
                                            },
                                            default: '',
                                            close:() => {}
                                        });
                                        dlg.render(true);
                                    }
                                }else if((count > 10000) || (text.length > 999)){
                                    if(option){
                                        return resolve(false)
                                    }else{
                                        const dlg = new Dialog({
                                            title: game.i18n.localize("SMALLW.CantBeTrans"),
                                            content: `<p>${game.i18n.localize("SMALLW.MsSingleLimit")}<br>${game.i18n.localize("SMALLW.ErrorWithoutTranslation")}</p><br><br><textarea readonly>${copy.content}</textarea>`,
                                            buttons:{
                                                yes:{
                                                    label:game.i18n.localize("SMALLW.Yes"),
                                                    icon: `<i class="fas fa-check"></i>`,
                                                    callback: () => {
                                                        ChatMessage.create(copy);
                                                    }
                                                },
                                                no:{
                                                    label:game.i18n.localize("SMALLW.No"),
                                                    icon: `<i class="fas fa-times"></i>`,
                                                    callback: () => {}
                                                }
                                            },
                                            default: '',
                                            close:() => {}
                                        });
                                        dlg.render(true);
                                    }
                                }else{
                                    let code2 = await game.settings.get(CONSTANTS.MODULE_NAME, "msunseenkey");
                                    let decode2 = await Code.decode(code2);
                                    const API_KEY2 = decode2;
                                    let lang2 = userLanguage;
                                    if(lang2 == "zh") lang2 = "zh-Hans";
                                    const API_URL2 = "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0" + `&from=${lang2}&to=${secondL}`;
                                    await $.when(
                                        getMstranslate(senddata, API_KEY2, API_URL2)
                                    )
                                    .done(async function (result){
                                        let reptrans = "";
                                        let i = 0;
                                        for(let j = 0; j < targetlist.length; j++){
                                            if(targetlist[j].tag) reptrans += targetlist[j].tag;
                                            if(targetlist[j].text) {
                                                if(result[i].translations[0].to == "tlh-Piqd"){
                                                    reptrans += `<span class="small-world-font-Piqd">` + result[i].translations[0].text + `</div>`;
                                                }else{
                                                    reptrans += result[i].translations[0].text;
                                                }
                                                i +=1;
                                            }
                                        }
                                        console.log(`Translated:${copy.content} => ${reptrans}`)
                                        chatData.content +=  `<div class="small-world-display-second small-world" style="display:none">` + reptrans + `</div>`;
                                        game.settings.set(CONSTANTS.MODULE_NAME, "translateMsCount", {count:charC2.count + count,limit: limit2});
                                        console.log(`Your translated text at Microsoft Translator is ${charC2.count + count}/${limit2} characters.`)
                                    })
                                    .fail(async function(result){
                                            if(option){
                                                return resolve(false)
                                            }else{
                                                let title =  game.i18n.localize("SMALLW.CantBeTrans");
                                                let content = `<p>${game.i18n.localize("SMALLW.ErrorTechnicalProblem")}<br>${game.i18n.localize("SMALLW.ErrorWithoutTranslation")}</p><br><br><textarea readonly>${copy.content}</textarea>`;
                                                await failpop(result, chatData =  copy, title, content);
                                            }
                                        }
                                    )
                                }
                            }else{
                                //First language = deepl, second language = deepl
                                if(charC.count + count + count > limit){
                                    if(option){
                                        return resolve(false)
                                    }else{
                                        const dlg = new Dialog({
                                            title: game.i18n.localize("SMALLW.CantBeTrans"),
                                            content: `<p>${game.i18n.localize("SMALLW.ErrorDeeplLimit")}<br>${game.i18n.localize("SMALLW.ErrorWithoutTranslation")}</p><br><br><textarea readonly>${copy.content}</textarea>`,
                                            buttons:{
                                                yes:{
                                                    label:game.i18n.localize("SMALLW.Yes"),
                                                    icon: `<i class="fas fa-check"></i>`,
                                                    callback: () => {
                                                        ChatMessage.create(copy);
                                                    }
                                                },
                                                no:{
                                                    label:game.i18n.localize("SMALLW.No"),
                                                    icon: `<i class="fas fa-times"></i>`,
                                                    callback: () => {}
                                                }
                                            },
                                            default: '',
                                            close:() => {}
                                        });
                                        dlg.render(true);
                                    }
                                }else if(bytes > 128000 || text.length > 50){
                                    if(option){
                                        return resolve(false)
                                    }else{
                                        const dlg = new Dialog({
                                            title: game.i18n.localize("SMALLW.CantBeTrans"),
                                            content: `<p>${game.i18n.localize("SMALLW.ErrorDeeplSingleLimit")}<br>${game.i18n.localize("SMALLW.ErrorWithoutTranslation")}</p><br><br><textarea readonly>${copy.content}</textarea>`,
                                            buttons:{
                                                yes:{
                                                    label:game.i18n.localize("SMALLW.Yes"),
                                                    icon: `<i class="fas fa-check"></i>`,
                                                    callback: () => {
                                                        ChatMessage.create(copy);
                                                    }
                                                },
                                                no:{
                                                    label:game.i18n.localize("SMALLW.No"),
                                                    icon: `<i class="fas fa-times"></i>`,
                                                    callback: () => {}
                                                }
                                            },
                                            default: '',
                                            close:() => {}
                                        });
                                        dlg.render(true);
                                    }
                                }else{
                                    let code = await game.settings.get(CONSTANTS.MODULE_NAME, "deeplunseenkey");
                                    let decode = await Code.decode(code);
                                    const API_KEY = decode;
                                    let pro = await game.settings.get(CONSTANTS.MODULE_NAME, "deeplpro");
                                    let url;
                                    if(pro){
                                        url = 'https://api.deepl.com/v2/translate';
                                    }else{
                                        url = 'https://api-free.deepl.com/v2/translate';
                                    }
                                    const API_URL = url;
                                    await $.when(
                                        getDeepltranslate(text, API_KEY, API_URL, userLanguage, transLang = secondL)
                                    )
                                    .done(async function (result){
                                        let reptrans = "";
                                        let i = 0;
                                        for(let j = 0; j < targetlist.length; j++){
                                            if(targetlist[j].tag) reptrans += targetlist[j].tag;
                                            if(targetlist[j].text) {reptrans += result.translations[i].text; i +=1;}
                                        }
                                        console.log(`Translated:${copy.content} => ${reptrans}`)
                                        chatData.content +=  `<div class="small-world-display-second small-world" style="display:none">` + reptrans + `</div>`;
                                        await getDeeplCount();
                                        let dlc = <any>await game.settings.get(CONSTANTS.MODULE_NAME, "translateDeeplCount");
                                        console.log(`Your translated text at DeepL is ${dlc.count}/${limit} characters.`);
                                    })
                                    .fail(async function(result){
                                            if(option){
                                                return resolve(false)
                                            }else{
                                                let title =  game.i18n.localize("SMALLW.CantBeTrans");
                                                let content = `<p>${game.i18n.localize("SMALLW.ErrorTechnicalProblem")}<br>${game.i18n.localize("SMALLW.ErrorWithoutTranslation")}</p><br><br><textarea readonly>${copy.content}</textarea>`;
                                                await failpop(result, chatData = copy, title, content);
                                            }
                                        }
                                    )
                                }
                            }
                        }else{
                            if(option){
                                return resolve(false)
                            }else{
                                chatData = null
                                const dlg = new Dialog({
                                    title: game.i18n.localize("SMALLW.CantBeTrans"),
                                    content: `<p>${game.i18n.localize("SMALLW.SecondLanguageDefault")}<br>${game.i18n.localize("SMALLW.ErrorWithoutTranslation")}</p><br><br><textarea readonly>${copy.content}</textarea>`,
                                    buttons:{
                                        yes:{
                                            label:game.i18n.localize("SMALLW.Yes"),
                                            icon: `<i class="fas fa-check"></i>`,
                                            callback: () => {
                                                ChatMessage.create(copy);
                                            }
                                        },
                                        no:{
                                            label:game.i18n.localize("SMALLW.No"),
                                            icon: `<i class="fas fa-times"></i>`,
                                            callback: () => {}
                                        }
                                    },
                                    default: '',
                                    close:() => {}
                                });
                                dlg.render(true);
                            }
                        }
                    }
                    await ChatMessage.create(chatData);
                    return resolve(true)
                })
                .fail(async function(result){
                        if(option){
                            return resolve(false)
                        }else{
                            let title =  game.i18n.localize("SMALLW.CantBeTrans");
                            let content = `<p>${game.i18n.localize("SMALLW.ErrorTechnicalProblem")}<br>${game.i18n.localize("SMALLW.ErrorWithoutTranslation")}</p><br><br><textarea readonly>${copy.content}</textarea>`;
                            await failpop(result, chatData = copy, title, content);
                        }
                    }
                )
            })();})
            game.user?.setFlag(CONSTANTS.MODULE_NAME, "translatable", true);
            return back
        }
    }else if(transType == 2){
        //First language = ms
        var charC = <any>await game.settings.get(CONSTANTS.MODULE_NAME, "translateMsCount");
        let limit = <number>await game.settings.get(CONSTANTS.MODULE_NAME, "mslimit");
        if(charC.count > limit){
            game.user?.setFlag(CONSTANTS.MODULE_NAME, "translatable", true);
            if(option){
                return false
            }else{
                const dlg = new Dialog({
                    title: game.i18n.localize("SMALLW.CantBeTrans"),
                    content: `<p>${game.i18n.localize("SMALLW.MsLimit")}<br>${game.i18n.localize("SMALLW.ErrorWithoutTranslation")}</p><br><br><textarea readonly>${copy.content}</textarea>`,
                    buttons:{
                        yes:{
                            label:game.i18n.localize("SMALLW.Yes"),
                            icon: `<i class="fas fa-check"></i>`,
                            callback: () => {
                                ChatMessage.create(copy);
                            }
                        },
                        no:{
                            label:game.i18n.localize("SMALLW.No"),
                            icon: `<i class="fas fa-times"></i>`,
                            callback: () => {}
                        }
                    },
                    default: '',
                    close:() => {}
                });
                dlg.render(true);
            }
        }else if((count > 10000) || (text.length > 999)){
            game.user?.setFlag(CONSTANTS.MODULE_NAME, "translatable", true);
            if(option){
                return false
            }else{
                const dlg = new Dialog({
                    title: game.i18n.localize("SMALLW.CantBeTrans"),
                    content: `<p>${game.i18n.localize("SMALLW.ErrorDeeplSingleLimit")}<br>${game.i18n.localize("SMALLW.ErrorWithoutTranslation")}</p><br><br><textarea readonly>${copy.content}</textarea>`,
                    buttons:{
                        yes:{
                            label:game.i18n.localize("SMALLW.Yes"),
                            icon: `<i class="fas fa-check"></i>`,
                            callback: () => {
                                ChatMessage.create(copy);
                            }
                        },
                        no:{
                            label:game.i18n.localize("SMALLW.No"),
                            icon: `<i class="fas fa-times"></i>`,
                            callback: () => {}
                        }
                    },
                    default: '',
                    close:() => {}
                });
                dlg.render(true);
            }
        }else{
            let back = await new Promise( resolve => {(async () => {
                let code = await game.settings.get(CONSTANTS.MODULE_NAME, "msunseenkey");
                if(detect) userLanguage = ""
                let decode = await Code.decode(code);
                const API_KEY = decode;
                let lang = userLanguage;
                if(lang == "zh") lang = "zh-Hans";
                const API_URL = "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0" + `&from=${lang}&to=${transLang}`;

                //let result;
                $.when(
                    getMstranslate(senddata, API_KEY, API_URL)
                )
                .done(async function (result){
                    let reptrans = "";
                    let i = 0;
                    for(let j = 0; j < targetlist.length; j++){
                        if(targetlist[j].tag) reptrans += targetlist[j].tag;
                        if(targetlist[j].text) {
                            if(result[i].translations[0].to == "tlh-Piqd"){
                                reptrans += `<span class="small-world-font-Piqd">` + result[i].translations[0].text + `</div>`;
                            }else{
                                reptrans += result[i].translations[0].text;
                            }
                            i +=1;
                        }
                    }
                    console.log(`Translated:${chatData.content} => ${reptrans}`)
                    chatData.flags[CONSTANTS.MODULE_NAME] = {origin:chatData.content,trans:{transLang:transLang, text: reptrans}, active:null, user:usersetting}
                    chatData.content = `<div class="small-world-display-default small-world" style="display:none">` + copy.content + `</div>`;
                    chatData.content +=  `<div class="small-world-display-first small-world" style="display:none">` + reptrans + `</div>`;
                    game.settings.set(CONSTANTS.MODULE_NAME, "translateMsCount", {count:charC.count + count,limit: limit});
                    console.log(`Your translated text at Microsoft Translator is ${charC.count + count}/${limit} characters.`)

                    //if bilingal setting = true
                    if(bilingual){
                        if(secondL != "default"){
                            if(secondL.match(/^small-world-font-/)){
                                //First language = ms, second language = original
                                let out = await getOriginalFontCode(text);
                                let reptrans = "";
                                let i = 0;
                                for(let j = 0; j < targetlist.length; j++){
                                    if(targetlist[j].tag) reptrans += targetlist[j].tag;
                                    if(targetlist[j].text) {
                                        if(tag.length == 1) {
                                            reptrans += `<span class="${secondL}">` + out[i] + `</span>`;
                                        }else{
                                            reptrans += `<span class="${secondL}" style="font-size:inherit">` + out[i] + `</span>`;
                                        }
                                        i +=1;}
                                }
                                chatData.content +=  `<div class="small-world-display-second small-world" style="display:none">` + reptrans + `</div>`;
                            }else if(secondL.match(/[a-z]/g)){
                                //First language = ms, second language = ms
                                if(charC.count + count > limit){
                                    if(option){
                                        return resolve(false)
                                    }else{
                                        const dlg = new Dialog({
                                            title: game.i18n.localize("SMALLW.CantBeTrans"),
                                            content: `<p>${game.i18n.localize("SMALLW.MsLimit")}<br>${game.i18n.localize("SMALLW.ErrorWithoutTranslation")}</p><br><br><textarea readonly>${copy.content}</textarea>`,
                                            buttons:{
                                                yes:{
                                                    label:game.i18n.localize("SMALLW.Yes"),
                                                    icon: `<i class="fas fa-check"></i>`,
                                                    callback: () => {
                                                        ChatMessage.create(copy);
                                                    }
                                                },
                                                no:{
                                                    label:game.i18n.localize("SMALLW.No"),
                                                    icon: `<i class="fas fa-times"></i>`,
                                                    callback: () => {}
                                                }
                                            },
                                            default: '',
                                            close:() => {}
                                        });
                                        dlg.render(true);
                                    }
                                }else if((count > 10000) || (text.length > 999)){
                                    if(option){
                                        return resolve(false)
                                    }else{
                                        const dlg = new Dialog({
                                            title: game.i18n.localize("SMALLW.CantBeTrans"),
                                            content: `<p>${game.i18n.localize("SMALLW.MsSingleLimit")}<br>${game.i18n.localize("SMALLW.ErrorWithoutTranslation")}</p><br><br><textarea readonly>${copy.content}</textarea>`,
                                            buttons:{
                                                yes:{
                                                    label:game.i18n.localize("SMALLW.Yes"),
                                                    icon: `<i class="fas fa-check"></i>`,
                                                    callback: () => {
                                                        ChatMessage.create(copy);
                                                    }
                                                },
                                                no:{
                                                    label:game.i18n.localize("SMALLW.No"),
                                                    icon: `<i class="fas fa-times"></i>`,
                                                    callback: () => {}
                                                }
                                            },
                                            default: '',
                                            close:() => {}
                                        });
                                        dlg.render(true);
                                    }
                                }else{
                                    const API_URL2 = "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0" + `&from=${lang}&to=${secondL}`;
                                    await $.when(
                                        getMstranslate(senddata, API_KEY, API_URL2)
                                    )
                                    .done(async function (result){
                                        let reptrans = "";
                                        let i = 0;
                                        for(let j = 0; j < targetlist.length; j++){
                                            if(targetlist[j].tag) reptrans += targetlist[j].tag;
                                            if(targetlist[j].text) {
                                                if(result[i].translations[0].to == "tlh-Piqd"){
                                                    reptrans += `<span class="small-world-font-Piqd">` + result[i].translations[0].text + `</div>`;
                                                }else{
                                                    reptrans += result[i].translations[0].text;
                                                }
                                                i +=1;
                                            }
                                        }
                                        console.log(`Translated:${copy.content} => ${reptrans}`)
                                        chatData.content +=  `<div class="small-world-display-second small-world" style="display:none">` + reptrans + `</div>`;
                                        game.settings.set(CONSTANTS.MODULE_NAME, "translateMsCount", {count:charC.count + count + count,limit: limit});
                                        console.log(`Your translated text at Microsoft Translator is ${charC.count + count + count}/${limit} characters.`)
                                    })
                                    .fail(async function(result){
                                            if(option){
                                                return resolve(false)
                                            }else{
                                                let title =  game.i18n.localize("SMALLW.CantBeTrans");
                                                let content = `<p>${game.i18n.localize("SMALLW.ErrorTechnicalProblem")}<br>${game.i18n.localize("SMALLW.ErrorWithoutTranslation")}</p><br><br><textarea readonly>${copy.content}</textarea>`;
                                                await failpop(result, chatData = copy, title, content);
                                            }
                                        }
                                    )
                                }
                            }else{
                                //First language = ms, second language = deepl
                                var charC2 = <any>await game.settings.get(CONSTANTS.MODULE_NAME, "translateDeeplCount");
                                let limit2 = <number>await game.settings.get(CONSTANTS.MODULE_NAME, "deepllimit");
                                if(charC2.count > limit2){
                                    if(option){
                                        return resolve(false)
                                    }else{
                                        const dlg = new Dialog({
                                            title: game.i18n.localize("SMALLW.CantBeTrans"),
                                            content: `<p>${game.i18n.localize("SMALLW.ErrorDeeplLimit")}<br>${game.i18n.localize("SMALLW.ErrorWithoutTranslation")}</p><br><br><textarea readonly>${copy.content}</textarea>`,
                                            buttons:{
                                                yes:{
                                                    label:game.i18n.localize("SMALLW.Yes"),
                                                    icon: `<i class="fas fa-check"></i>`,
                                                    callback: () => {
                                                        ChatMessage.create(copy);
                                                    }
                                                },
                                                no:{
                                                    label:game.i18n.localize("SMALLW.No"),
                                                    icon: `<i class="fas fa-times"></i>`,
                                                    callback: () => {}
                                                }
                                            },
                                            default: '',
                                            close:() => {}
                                        });
                                        dlg.render(true);
                                    }
                                }else if(bytes > 128000 || text.length > 50){
                                    if(option){
                                        return resolve(false)
                                    }else{
                                        const dlg = new Dialog({
                                            title: game.i18n.localize("SMALLW.CantBeTrans"),
                                            content: `<p>${game.i18n.localize("SMALLW.ErrorDeeplSingleLimit")}<br>${game.i18n.localize("SMALLW.ErrorWithoutTranslation")}</p><br><br><textarea readonly>${copy.content}</textarea>`,
                                            buttons:{
                                                yes:{
                                                    label:game.i18n.localize("SMALLW.Yes"),
                                                    icon: `<i class="fas fa-check"></i>`,
                                                    callback: () => {
                                                        ChatMessage.create(copy);
                                                    }
                                                },
                                                no:{
                                                    label:game.i18n.localize("SMALLW.No"),
                                                    icon: `<i class="fas fa-times"></i>`,
                                                    callback: () => {}
                                                }
                                            },
                                            default: '',
                                            close:() => {}
                                        });
                                        dlg.render(true);
                                    }
                                }else{
                                    let code2 = await game.settings.get(CONSTANTS.MODULE_NAME, "deeplunseenkey");
                                    let decode2 = await Code.decode(code2);
                                    const API_KEY2 = decode2;
                                    let pro = await game.settings.get(CONSTANTS.MODULE_NAME, "deeplpro");
                                    let url2;
                                    if(pro){
                                        url2 = 'https://api.deepl.com/v2/translate';
                                    }else{
                                        url2 = 'https://api-free.deepl.com/v2/translate';
                                    }
                                    const API_URL2 = url2;
                                    await $.when(
                                        getDeepltranslate(text, API_KEY2, API_URL2, userLanguage, transLang = secondL)
                                    )
                                    .done(async function (result){
                                        let reptrans = "";
                                        let i = 0;
                                        for(let j = 0; j < targetlist.length; j++){
                                            if(targetlist[j].tag) reptrans += targetlist[j].tag;
                                            if(targetlist[j].text) {reptrans += result.translations[i].text; i +=1;}
                                        }
                                        console.log(`Translated:${copy.content} => ${reptrans}`)
                                        chatData.content +=  `<div class="small-world-display-second small-world" style="display:none">` + reptrans + `</div>`;
                                        await getDeeplCount();
                                        let dlc = <any>await game.settings.get(CONSTANTS.MODULE_NAME, "translateDeeplCount");
                                        console.log(`Your translated text at DeepL is ${dlc.count}/${limit2} characters.`);
                                    })
                                    .fail(async function(result){
                                            if(option){
                                                return resolve(false)
                                            }else{
                                                let title =  game.i18n.localize("SMALLW.CantBeTrans");
                                                let content = `<p>${game.i18n.localize("SMALLW.ErrorTechnicalProblem")}<br>${game.i18n.localize("SMALLW.ErrorWithoutTranslation")}</p><br><br><textarea readonly>${copy.content}</textarea>`;
                                                await failpop(result, copy, title, content);
                                            }
                                        }
                                    )
                                }
                            }
                        }else{
                            if(option){
                                return resolve(false)
                            }else{
                                chatData = null
                                const dlg = new Dialog({
                                    title: game.i18n.localize("SMALLW.CantBeTrans"),
                                    content: `<p>${game.i18n.localize("SMALLW.SecondLanguageDefault")}<br>${game.i18n.localize("SMALLW.ErrorWithoutTranslation")}</p><br><br><textarea readonly>${copy.content}</textarea>`,
                                    buttons:{
                                        yes:{
                                            label:game.i18n.localize("SMALLW.Yes"),
                                            icon: `<i class="fas fa-check"></i>`,
                                            callback: () => {
                                                ChatMessage.create(copy);
                                            }
                                        },
                                        no:{
                                            label:game.i18n.localize("SMALLW.No"),
                                            icon: `<i class="fas fa-times"></i>`,
                                            callback: () => {}
                                        }
                                    },
                                    default: '',
                                    close:() => {}
                                });
                                dlg.render(true);
                            }
                        }
                    }
                    await ChatMessage.create(chatData);
                    return resolve(true)
                })
                .fail(async function(result){
                        if(option){
                            return resolve(false)
                        }else{
                            let title =  game.i18n.localize("SMALLW.CantBeTrans");
                            let content = `<p>${game.i18n.localize("SMALLW.ErrorTechnicalProblem")}<br>${game.i18n.localize("SMALLW.ErrorWithoutTranslation")}</p><br><br><textarea readonly>${copy.content}</textarea>`;
                            await failpop(result, chatData = copy, title, content);
                        }
                    }
                )
            })()});
            game.user?.setFlag(CONSTANTS.MODULE_NAME, "translatable", true);
            return back
        }
    }
}

export async function failpop(result, chatData, title, content){
    console.error(result);
    const dlg = new Dialog({
        title:title,
        content: content,
        buttons:{
            yes:{
                label:game.i18n.localize("SMALLW.Yes"),
                icon: `<i class="fas fa-check"></i>`,
                callback: () => {
                    ChatMessage.create(chatData);
                    return true;
                }
            },
            no:{
                label:game.i18n.localize("SMALLW.No"),
                icon: `<i class="fas fa-times"></i>`,
                callback: () => {return true}
            }
        },
        default: '',
        close:() => {return false}
    });
    dlg.render(true);

}

export async function awaitpop(packet, title, content){
    const dlg = new Dialog({
        title:title,
        content: content,
        buttons:{
            yes:{
                label:game.i18n.localize("SMALLW.OriginalText"),
                icon: `<i class="fas fa-check"></i>`,
                callback: () => {
                    ChatMessage.create(packet.data.copy);
                    return false;
                }
            },
            check:{
                label:game.i18n.localize("SMALLW.CheckExecute"),
                icon: `<i class="fas fa-search"></i>`,
                callback: async () => {
                    game.socket?.emit('module.small-world', packet);
                }
            },
            no:{
                label:game.i18n.localize("SMALLW.Withdraw"),
                icon: `<i class="fas fa-times"></i>`,
                callback: () => {return true}
            }
        },
        default: '',
        close:() => {return false}
    });
    dlg.render(true);
}

export async function awaitself(data, copy){
    const dlg = new Dialog({
        title: game.i18n.localize("SMALLW.AwaitSend"),
        content: `<p>${game.i18n.localize("SMALLW.AwaitSendContent")}<br>${game.i18n.localize("SMALLW.AwaitSendSelect")}</p><br><br>${game.i18n.localize("SMALLW.OriginalText")}:<br><textarea readonly>${copy.content}</textarea>`,
        buttons:{
            force:{
                label:game.i18n.localize("SMALLW.Force"),
                icon: `<i class="fas fa-bomb"></i>`,
                callback: () => {
                    createTranslation({...data});
                    return true;
                }
            },
            check:{
                label:game.i18n.localize("SMALLW.CheckExecute"),
                icon: `<i class="fas fa-search"></i>`,
                callback: async () => {
                    let status = await game.user?.getFlag(CONSTANTS.MODULE_NAME, "translatable");
                    if(status){
                        createTranslation({...data});
                        return true;
                    }else{
                        awaitself(data, copy);
                        return false;
                    }
                }
            },
            no:{
                label:game.i18n.localize("SMALLW.Withdraw"),
                icon: `<i class="fas fa-times"></i>`,
                callback: () => {return false}
            }
        },
        default: '',
        close:() => {return false}
    });
    dlg.render(true);
}

export async function getDeepltranslate(text, API_KEY, API_URL, userLanguage, transLang){
    var defer = $.Deferred();
    $.ajax({
        type:"POST",
        url:API_URL,
        data:{
            "auth_key": API_KEY,
            "text": text,
            "source_lang": userLanguage.toUpperCase(),
            "target_lang": transLang,
        },
        traditional: true,
        dataType: "json",
        success:function(data){
            defer.resolve(data);
        },
        error:function(data){
            defer.reject(data);
        }
    })
    return defer.promise(this);
}

export async function getOriginalFontCode(text){
    let out = <string[]>[];
    for(let i = 0;i < text.length; i++){
        let c = await Code.b64encode(text[i]);
        let d = <string>await Code.b64encode(c);
        d = d.substr(3);
        d = d.replace(/\=/g, "")
        var  l = <string[]>d.split("");
        var space = <string[][]>[];
        let t = true
        let n=0;
        while (t){
            n = getRandomIntInclusive(1, 9);
            if(l.length > text.length) {
                t = false;
            }
        }
        while (l.length > n){
            let a = <string[]>l.splice(0, n);
            space.push(a)
            n = getRandomIntInclusive(1, 9);
        }
        space.push(l)
        let e = getRandomIntInclusive(0, 1);
         e += Math.round(text[i].length / 3);
        space = space.splice(0, e);
        let f = "";
        for(let j =0 ; j < space.length; j++){
            f += space[j]?.join('');
            if(j != (space.length - 1)) f+= " "
        }
        out.push(f)
    }
    return out
}

export async function getMstranslate(senddata, API_KEY, API_URL){
    var defer = $.Deferred();
    $.ajax({
        type: "POST",
        url: API_URL,
        headers:{
            "Ocp-Apim-Subscription-Key": API_KEY,
            "Content-Type": "application/json; charset=UTF-8"
        },
        dataType: "json",
        data: senddata,
        success:function(data){
            defer.resolve(data);
        },
        error:function(data){
            defer.reject(data);
        }
    })
    return defer.promise(this);
}

export async function getDeeplCount(){
    let code = await game.settings.get(CONSTANTS.MODULE_NAME, "deeplunseenkey");
    let decode = await Code.decode(code);
    let pro = await game.settings.get(CONSTANTS.MODULE_NAME, "deeplpro");
    const API_KEY = decode;
    let url;
    if(pro){
        url = 'https://api.deepl.com/v2/usage';
    }else{
        url = 'https://api-free.deepl.com/v2/usage';
    }
    const API_URL = url;
    await $.ajax({
        type:"GET",
        url:API_URL,
        data:{
            "auth_key": API_KEY,
        },
        dataType: "json"
    })
    .done(async function(data){
        await game.settings.set(CONSTANTS.MODULE_NAME, "translateDeeplCount", {count: data.character_count, limit: data.character_limit})
    })
    .fail(async function(data){
        console.error(data)
    })
}

export function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}
