import type { ChatMessageData, UserData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs";
import CONSTANTS from "./constants";
import { htmlTokenizer } from "./lib/htmlTokenizer";
import { awaitpop, awaitself, createTranslation, failpop, getDeeplCount, getOption, getRandomIntInclusive, getTranslatablelist, translateActivate, translateType, translateUserSelect } from "./lib/lib";
import { Code } from "./small-world-code";
import { TransChat } from "./small-world-transchat";

//@ts-ignore
String.prototype.bytes = function () {
    return(encodeURIComponent(this).replace(/%../g,"x").length);
}

export const initHooks = () => {


};

export const setupHooks = () => {


};

export const readyHooks = async () => {
    await getTranslatablelist(true, true, true);
    const userlang = await game.settings.get("core", "language");
    const langlist = <any>await game.settings.get(CONSTANTS.MODULE_NAME, "translateTable");
    let serch = langlist.deepl?.find((u) => u.language.toLowerCase() == userlang.toLowerCase());

    if(!serch) {
        serch = langlist.microsoft?.translation[`${userlang.toLowerCase()}`]
    }

    if(!!serch) {
        await game.settings.set(CONSTANTS.MODULE_NAME, "userLanguage", userlang)
    }else{
        await game.settings.set(CONSTANTS.MODULE_NAME, "userLanguage", "")
    }
    if(userlang == "zh-CN" || userlang == "cn" || userlang == "CN") {
        await game.settings.set(CONSTANTS.MODULE_NAME, "userLanguage", "zh");
    }

    await getTranslatablelist(true, true, false);

    const chatControls = <HTMLElement>window.document.getElementById("chat-controls");
    let translateButtons = chatControls.getElementsByClassName("translate-buttons")[0];
    let transResource0 =  <HTMLAnchorElement>window.document.createElement("a");
    let transResource1 =   <HTMLAnchorElement>window.document.createElement("a");
    let transResource2 =   <HTMLAnchorElement>window.document.createElement("a");
    let transResource3 =   <HTMLAnchorElement>window.document.createElement("a");
    let transResource4 =   <HTMLAnchorElement>window.document.createElement("a");
    transResource0.addEventListener("click", translateType.bind(this));
    transResource1.addEventListener("click", translateType.bind(this));
    transResource2.addEventListener("click", translateType.bind(this));
    transResource3.addEventListener("click", translateActivate.bind(this));
    transResource4.addEventListener("click", translateUserSelect.bind(this));
    transResource0.title = game.i18n.localize("SMALLW.Encryption");
    transResource1.title = game.i18n.localize("SMALLW.Deepl");
    transResource2.title = game.i18n.localize("SMALLW.MicrosoftTranslator");
    transResource3.title = game.i18n.localize("SMALLW.SwitchTrans");
    transResource4.title = game.i18n.localize("SMALLW.SettingForUsers");
    let icon0 =  window.document.createElement("i");
    let icon1 =  window.document.createElement("i");
    let icon2 =  window.document.createElement("i");
    let icon3 =  window.document.createElement("i");
    let icon4 =  window.document.createElement("i");
    $(icon1).css({
        "font-size": "var(--font-size-18)",
    });
    $(icon2).css({
        "font-size": "var(--font-size-20)",
        "line-height": "28px"
    });
    $(icon3).css({
        "font-size": "var(--font-size-18)",
    });
    $(transResource0).css({
        display: "inline-block",
        width: "20px",
        "text-align": "center",
        margin: "0px 4px"
    });
    $(transResource1).css({
        display: "none",
        width: "20px",
        "text-align": "center",
        margin: "0px 4px"
    });
    $(transResource2).css({
        display: "none",
        width: "20px",
        "text-align": "center",
        margin: "0px 4px"
    });
    $(transResource3).css({
        display: "inline-block",
        width: "20px",
        "text-align": "center",
        margin: "0px 4px"
    });
    $(transResource4).css({
        display: "inline-block",
        width: "20px",
        "text-align": "center",
        margin: "0px 4px"
    });
    $(icon0).addClass("fas fa-dragon");
    $(icon1).addClass("fas fa-project-diagram");
    $(icon2).addClass("fab fa-microsoft");
    $(icon3).addClass("fas fa-language");
    $(icon4).addClass("fas fa-user-tag");
    $(transResource0).addClass("translate-local");
    $(transResource1).addClass("translate-deepl");
    $(transResource2).addClass("translate-microsoft");
    transResource0.appendChild(icon0);
    transResource1.appendChild(icon1);
    transResource2.appendChild(icon2);
    transResource3.appendChild(icon3);
    transResource4.appendChild(icon4);
    let transToSelect = document.createElement("select");
    $(transToSelect).addClass("translate-select");
    let sel = await game.settings.get(CONSTANTS.MODULE_NAME, "selectedLang");
    let opt = await getOption(0, transToSelect, sel);

    transToSelect.style["width"] = "195px";
    transToSelect.style["background"] = "rgba(255, 255, 245, 0.8)";
    transToSelect.style["margin"] = "0px 4px";
    transToSelect.addEventListener('change', async function(){
        await game.settings.set(CONSTANTS.MODULE_NAME, "selectedLang", this.value);
    })
    transToSelect.title = game.i18n.localize("SMALLW.TargetLanguage")

    if(translateButtons){

    }else{
        translateButtons = <Element>document.createElement("div");
        $(translateButtons).addClass("translate-buttons");
        //@ts-ignore
        translateButtons.style["flex-basis"] = "130px";
        translateButtons.appendChild(transResource0);
        translateButtons.appendChild(transResource1);
        translateButtons.appendChild(transResource2);
        translateButtons.appendChild(transResource3);
        translateButtons.appendChild(transResource4);
        translateButtons.appendChild(transToSelect);
        chatControls.appendChild(translateButtons);
    }

    let transType = await game.settings.get(CONSTANTS.MODULE_NAME, "translateType");
    let tlist = <any>await game.settings.get(CONSTANTS.MODULE_NAME, "translateTable");
    let msStatus = await game.settings.get(CONSTANTS.MODULE_NAME, "MsConnectionStatus");
    let gmtrans = await game.settings.get(CONSTANTS.MODULE_NAME, "gmTranslate");
    let worltable = <any>await game.settings.get(CONSTANTS.MODULE_NAME, "worldtranslateTable");
    if((!msStatus && (!gmtrans || !worltable.microsoft)) && (transType == 2)) {
        transType = 0;
        await game.settings.set(CONSTANTS.MODULE_NAME, "translateType", 0);
        await game.settings.set(CONSTANTS.MODULE_NAME, "selectedLang", "");
    }
    if((tlist.deepl == null) && (transType == 1)) {
        transType = 0;
        await game.settings.set(CONSTANTS.MODULE_NAME, "translateType", 0);
        await game.settings.set(CONSTANTS.MODULE_NAME, "selectedLang", "");
    }

    if(transType == 1) {
        $(transResource0).css({
            "display": "none"
        })
        $(transResource1).css({
            "display": "inline-block"
        });
        transToSelect.options.length = 0;
        let sel = await game.settings.get(CONSTANTS.MODULE_NAME, "selectedLang");
        await getOption(1, transToSelect, sel);
    }else if(transType == 2){
        $(transResource0).css({
            "display": "none"
        })
        $(transResource2).css({
            "display": "inline-block"
        });
        transToSelect.options.length = 0;
        let sel = await game.settings.get(CONSTANTS.MODULE_NAME, "selectedLang");
        await getOption(2, transToSelect, sel);
    }
    let activate = await game.settings.get(CONSTANTS.MODULE_NAME, "translateActivate");
    if(activate){
        $(transResource3).css({
            "border-left": "1px solid red",
            "border-right": "1px solid red",
            "box-shadow": "0 0 6px inset #ff6400",
            "background": "radial-gradient(closest-side at 50%, red 1%, transparent 99%)"
        })
    }

    game.socket?.on('module.small-world', async (packet) => {
        const data = packet.data;
        const type = packet.type;
        const receiveUserId = packet.receiveUserId;
        const sendUserId = packet.sendUserId;
        if(receiveUserId == game.user?.id){
            if(type == "request"){
                let status = await game.user?.getFlag(CONSTANTS.MODULE_NAME, "translatable");
                if(status){
                    let result = await createTranslation({...data, option:true});
                    if(result){
                        let sendData = {data:null, type:"complete", sendUserId:game.user?.id, receiveUserId: sendUserId}
                        game.socket?.emit('module.small-world', sendData)
                    }else{
                        let sendData = {data:data, type:"fail", sendUserId:game.user?.id, receiveUserId: sendUserId}
                        game.socket?.emit('module.small-world', sendData)
                    }
                }else{
                    let sendData = {data:data, type:"await", sendUserId:game.user?.id, receiveUserId: sendUserId}
                    game.socket?.emit('module.small-world', sendData)
                }
            }
            if(type == "complete"){
                console.log(game.i18n.format("SMALLW.Complete", {user:game.users?.get(sendUserId)?.name}))
            }
            if(type == "fail"){
                let title =  game.i18n.localize("SMALLW.CantBeTrans");
                let content = `<p>${game.i18n.localize("SMALLW.ErrorTechnicalProblem")}<br>${game.i18n.localize("SMALLW.ErrorWithoutTranslation")}</p><br><br><textarea readonly>${data.copy.content}</textarea>`;
                await failpop(
                    game.i18n.localize("SMALLW.ErrorTechnicalProblem"),
                    data.copy,
                    title,
                    content
                );
            }
            if(type == "await"){
                let title = game.i18n.localize("SMALLW.AwaitSend");
                let content = `<p>${game.i18n.localize("SMALLW.AwaitSendContent")}<br>${game.i18n.localize("SMALLW.AwaitSelect")}</p><br><br>${game.i18n.localize("SMALLW.OriginalText")}:<br><textarea readonly>${data.copy.content}</textarea>`;
                let sendData = {data:data, type:"request", sendUserId:game.user?.id, receiveUserId: sendUserId}
                awaitpop(packet = sendData, title, content);
            }
        }
    });
};

Hooks.on("renderChatMessage",  (message,html,data) => {
    html.on('dblclick', 'div.small-world', cl.bind(this))
    async function cl(event){
        if(event.shiftKey){
            event.preventDefault();
            let setting = await game.settings.get(CONSTANTS.MODULE_NAME, "dblFunction");
            if(!setting || (game.user?.isGM)){
                $(event.currentTarget).css('display', "none");
                if(!$(event.currentTarget).next(`div.small-world`)[0]){
                    $(event.currentTarget).parent().children(`div.small-world-display-default`).css('display', "inherit")
                }else{
                    $(event.currentTarget).next(`div.small-world`).css('display', "inherit")
                }
            }
        }
    }
    //@ts-ignore
    if(message.data.flags[CONSTANTS.MODULE_NAME]?.user){
        //@ts-ignore
        let users = <any[]>message.data?.flags[CONSTANTS.MODULE_NAME]?.user;
        let index = users.findIndex(i => i.id == game.user?.id);
        if(index >= 0){
            html.find(`div.message-content`).find(`div.small-world`).each(function(idx, element) {
                if(users[index].type == 0){
                    if($(element).hasClass(`small-world-display-default`)) {
                        $(element).css('display', "inherit")
                    }
                }else if(users[index].type == 1){
                    if($(element).hasClass(`small-world-display-first`)) {
                        $(element).css('display', "inherit")
                    }
                }else if(users[index].type == 2){
                    if($(element).hasClass(`small-world-display-second`)) {
                        $(element).css('display', "inherit")
                    }
                }
            });
        }
    }
})









Hooks.on("chatMessage", async (chatLog, message, chatData:ChatMessageData) =>{
    let parse = TransChat.parse(message);
    let notskip = false
    switch (parse[0]) {
        case "roll": case "gmroll": case "blindroll": case "selfroll": case "publicroll": case "macro":
            {
                notskip = true;
                break;
            }
        case "whisper": case "reply": case "gm": case "players": case "ic": case "emote": case "ooc":
            {
                notskip = false;
                break;
            }
    }

    if(!notskip){
        Hooks.once("preCreateChatMessage",(document, data, options, userId) => {
            if(!document.data.flags.translate){
                return false
            }
        });

        let activate = await game.settings.get(CONSTANTS.MODULE_NAME, "translateActivate");
        if(activate){
            let transType = await game.settings.get(CONSTANTS.MODULE_NAME, "translateType");
            let transLang = await game.settings.get(CONSTANTS.MODULE_NAME, "selectedLang");
            if(transLang == ""){
                ui.notifications.error(game.i18n.localize("SMALLW.ErrorTargetLangNone"));
                const dlg = new Dialog({
                    title: game.i18n.localize("SMALLW.ErrorTargetLangNone"),
                    content: `<p>${game.i18n.localize("SMALLW.ErrorWithoutTranslation")}</p><br><br><textarea readonly>${chatData.content}</textarea>`,
                    buttons:{
                        yes:{
                            label: game.i18n.localize("SMALLW.Yes"),
                            icon: `<i class="fas fa-check"></i>`,
                            callback: () => {
                                ChatMessage.create(chatData);
                            }
                        },
                        no:{
                            label: game.i18n.localize("SMALLW.No"),
                            icon: `<i class="fas fa-times"></i>`,
                            callback: () => {}
                        }
                    },
                    default: '',
                    close:() => {}
                });
                dlg.render(true);
            }else{
                let copy = {...chatData};
                let tag = <string[]>htmlTokenizer(chatData.content) || <string[]>[];
                var targetlist = <{tag:string; text:string}[]>[];
                if(tag.length == 0) tag.push(chatData.content)
                var text = <string[]>[]
                for(let z = 0; z < tag.length; z++){
                    let t = "";
                    let tex = "";
                    let link = false;
                    if(tag[z]?.match(/^\<.*?\>/)) {
                        t = <string>tag[z];
                    }
                    else{
                        tex = <string>tag[z]
                    }
                    targetlist.push({tag:t, text:tex});
                    if(tex) {
                        text.push(tex);
                    }
                }
                let senddata = "[";
                let count = 0;
                for(let i = 0; i < text.length; i++){
                    senddata += `{"Text": "${text[i]}"}`
                    count += <number>text[i]?.length;
                    if(i != (text.length - 1)) {
                        senddata += ",";
                    }
                }
                senddata += "]"

                let usersetting = <User[]>await game.user?.getFlag(CONSTANTS.MODULE_NAME, "select-users");
                let bilingual = <boolean>await game.settings.get(CONSTANTS.MODULE_NAME, "bilingual");
                let secondL = <string>await game.settings.get(CONSTANTS.MODULE_NAME, "second-language");
                let userLanguage = <string>await game.settings.get(CONSTANTS.MODULE_NAME, "userLanguage");
                let detect = <boolean>await game.settings.get(CONSTANTS.MODULE_NAME, "dontDetectLang");
                let status = <number>game.user?.getFlag(CONSTANTS.MODULE_NAME, "translatable");

                const data = {transType, transLang, chatData, copy, tag, targetlist, text, senddata, count, usersetting, bilingual, secondL, userLanguage, detect}

                let gmsetting = await game.settings.get(CONSTANTS.MODULE_NAME, "gmTranslate");
                let gmlist = <{deepl:any, microsoft:any; gmid:string}[]>await game.settings.get(CONSTANTS.MODULE_NAME, "canTranslateList");
                let check1, check2, check3 = false;
                let secondType;
                if(secondL != "default"){
                    if(secondL.match(/^small-world-font-/)){
                        secondType = "origin"
                    }else if(secondL.match(/^[a-z]/)){
                        secondType = "microsoft"
                    }else{
                        secondType = "deepl"
                    }
                }
                if(gmsetting){
                    let activelist = <{deepl:any, microsoft:any; gmid:string}[]>gmlist.filter(j => (game.users?.get(j.gmid)?.active && j.deepl == true && j.microsoft == true));
                    for(let s = 0;s < activelist.length; s++){
                        if(!activelist[s]){
                            continue;
                        }
                        if(transType == 0) {
                            check1 = true;
                        }
                        if(secondType == "origin") {
                            check2 = true;
                        }
                        if((transType == 0) && (secondType == "origin")) {
                            check3 = true;
                        }
                        if((transType == 1) && activelist[s]?.deepl) {
                            check1 = activelist[s]?.gmid;
                        }
                        if((transType == 2) && activelist[s]?.microsoft) {
                            check1 = activelist[s]?.gmid;
                        }
                        if((secondType == "deepl") && activelist[s]?.deepl) {
                            check2 = activelist[s]?.gmid;
                        }
                        if((secondType == "microsoft") && activelist[s]?.microsoft) {
                            check2 = activelist[s]?.gmid;
                        }
                    }

                    if(check3) {
                        await createTranslation({...data})
                    }else if(!!check1 && !!check2){
                        let msself = <any>await game.settings.get(CONSTANTS.MODULE_NAME, "MsConnectionStatus");
                        let dlself = (<any>await game.settings.get(CONSTANTS.MODULE_NAME, "translateTable"))?.deepl;
                        dlself = !!dlself;
                        if(check1 === true) {
                            if(game.user?.id == check2){
                                if(status){
                                    createTranslation({...data});
                                }else{
                                    awaitself(data, copy);
                                }
                            }else{
                                if(dlself && msself){
                                    if(status){
                                        createTranslation({...data});
                                    }else{
                                        awaitself(data, copy);
                                    }
                                }else{
                                    let packet = {data:data, type:"request", receiveUserId: check2, sendUserId:game.user?.id}
                                    game.socket?.emit('module.small-world', packet);
                                }
                            }
                        }else if(check2 === true) {
                            if(game.user?.id == check1){
                                if(status){
                                    createTranslation({...data});
                                }else{
                                    awaitself(data, copy);
                                }
                            }else{
                                if(dlself && msself){
                                    if(status){
                                        createTranslation({...data});
                                    }else{
                                        awaitself(data, copy);
                                    }
                                }else{
                                    let packet = {data:data, type:"request", receiveUserId: check1, sendUserId:game.user?.id}
                                    game.socket?.emit('module.small-world', packet);
                                }
                            }
                        }else{
                            if(game.user?.id == check1){
                                if(status){
                                    createTranslation({...data});
                                }else{
                                    awaitself(data, copy);
                                }
                            }else{
                                if(dlself && msself){
                                    if(status){
                                        createTranslation({...data});
                                    }else{
                                        awaitself(data, copy);
                                    }
                                }else{
                                    let packet = {data:data, type:"request", receiveUserId: check2, sendUserId:game.user?.id}
                                    game.socket?.emit('module.small-world', packet);
                                }
                            }
                        }
                    }else{
                        if(status){
                            createTranslation({...data});
                        }else{
                            awaitself(data, copy);
                        }
                    }
                }else{
                    if(status){
                        createTranslation({...data});
                    }else{
                        awaitself(data, copy);
                    }
                }
            }
        }else{
            ChatMessage.create(chatData)
        }
    }
});


