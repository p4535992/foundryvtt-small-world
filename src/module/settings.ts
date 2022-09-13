import CONSTANTS from "./constants";
import { getDeeplCount, getTranslatablelist, ORIGINAL_FONT_LIST } from "./lib/lib";
import { Code } from "./small-world-code";

export const registerSettings = async function (): Promise<void> {
	game.settings.registerMenu(CONSTANTS.MODULE_NAME, "resetAllSettings", {
		name: `${CONSTANTS.MODULE_NAME}.setting.reset.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.reset.hint`,
		icon: "fas fa-coins",
		type: ResetSettingsDialog,
		restricted: true,
	});

	// =====================================================================

    game.settings.register(CONSTANTS.MODULE_NAME, "transnow",{
        name:"translate now",
        scope: "client",
        config:false,
        type:Boolean,
        default:false
    });
    game.settings.register(CONSTANTS.MODULE_NAME, "translateType",{
        name: "Translate type",
        scope: "client",
        config: false,
        default: 0,
        type:Number
    });
    game.settings.register(CONSTANTS.MODULE_NAME, "translateActivate",{
        name: "Web translate activate",
        scope: "client",
        config: false,
        default: false,
        type:Boolean
    });
    game.settings.register(CONSTANTS.MODULE_NAME, "canTranslateList",{
        name: "List of Contractors for Translation",
        scope: "world",
        config: false,
        default: [],
        type:Object
    });
    game.settings.register(CONSTANTS.MODULE_NAME, "selectedLang",{
        name: "Selected language",
        scope: "client",
        config: false,
        default: "",
        type:String
    });
    game.settings.register(CONSTANTS.MODULE_NAME, "translateTable",{
        name: "translatable languages list",
        scope: "client",
        config: false,
        default: {deepl:null, microsoft:null},
        type:Object
    });
    game.settings.register(CONSTANTS.MODULE_NAME, "worldtranslateTable",{
        name: "translatable languages list (world)",
        scope: "world",
        config: false,
        default: {deepl:null, microsoft:null},
        type:Object
    });
    game.settings.register(CONSTANTS.MODULE_NAME, "translateDeeplCount",{
        name: "Deepl translate char count",
        scope: "client",
        config: false,
        default: {count:0,limit:0},
        type:Object
    });
    game.settings.register(CONSTANTS.MODULE_NAME, "translateMsCount",{
        name: "Microsoft translate char count",
        scope: "client",
        config: false,
        default: {count:0, limit:0},
        type:Object
    });
    game.settings.register(CONSTANTS.MODULE_NAME, "deeplunseenkey", {
        name: "Deepl unseen Key",
        scope: "client",
        config: false,
        default: "",
        type: String
    });
    game.settings.register(CONSTANTS.MODULE_NAME, "msunseenkey", {
        name: "Microsoft unseen Key",
        scope: "client",
        config: false,
        default: "",
        type: String
    });
    game.settings.register(CONSTANTS.MODULE_NAME, "deeplkeyin", {
        name: "SMALLW.DeeplApiSecretKey",
        scope: "client",
        config: true,
        default: "",
        type: String,
        onChange: async (pass) => {
            if(pass != "*********************"){
                let code = await Code.encodechar(pass);
                let decode = await Code.decode(code);
                if(pass == decode) {
                    await game.settings.set(CONSTANTS.MODULE_NAME, "deeplunseenkey", code);
                    await getTranslatablelist(true, false, true)
                }else{
                    console.error("decode error")
                }
                await game.settings.set(CONSTANTS.MODULE_NAME, "deeplkeyin", "*********************");
                //@ts-ignore
                foundry.utils.debounce(window.location.reload(), 100)
            }
        }
    });
    game.settings.register(CONSTANTS.MODULE_NAME, "deeplpro", {
        name: "SMALLW.DeeplPro",
        scope: "client",
        config: true,
        default: false,
        type: Boolean
    });

    game.settings.register(CONSTANTS.MODULE_NAME, "deepllimit", {
        name: "SMALLW.DeeplLimit",
        hint: "SMALLW.DeeplLimitHint",
        scope: "client",
        config: true,
        default: 490000,
        type: Number,
        onChange: async (n) => {
            if(n == null){
                await getDeeplCount();
                let c = <{count:number, limit:number}>await game.settings.get(CONSTANTS.MODULE_NAME, "translateDeeplCount");
                await game.settings.set(CONSTANTS.MODULE_NAME, "deepllimit", c.limit - 10000)
            }
        }
    });
    game.settings.register(CONSTANTS.MODULE_NAME, "mskeyin", {
        name: "SMALLW.MicrosoftApiSecretKey",
        scope: "client",
        config: true,
        default: "",
        type: String,
        onChange: async (pass) => {
            if(pass != "*********************"){
                let code = await Code.encodechar(pass);
                let decode = await Code.decode(code);
                if(pass == decode) {
                    await game.settings.set(CONSTANTS.MODULE_NAME, "msunseenkey", code);
                    await getTranslatablelist(false, true, true)
                }else{
                    console.error("decode error")
                }
                await game.settings.set(CONSTANTS.MODULE_NAME, "mskeyin", "*********************");
                //@ts-ignore
                foundry.utils.debounce(window.location.reload(), 100)
            }
        }
    });
    game.settings.register(CONSTANTS.MODULE_NAME, "mslimit", {
        name: "SMALLW.MicrosoftLimit",
        hint: "SMALLW.MicrosoftLimitHint",
        scope: "client",
        config: true,
        default: 1990000,
        type: Number,
        onChange: async (n:number) =>{
            let c = <{count:number, limit:number}>await game.settings.get(CONSTANTS.MODULE_NAME, "translateMsCount");
            c.limit = n;
            await game.settings.set(CONSTANTS.MODULE_NAME, "translateMsCount", c);
        }
    });
    game.settings.register(CONSTANTS.MODULE_NAME, "msCountReset", {
        name: "SMALLW.MsCountReset",
        hint: "SMALLW.MsCountResetHint",
        scope: "client",
        config: true,
        default: false,
        type: Boolean,
        onChange: async (n) => {
            if(n){
                let lim = await game.settings.get(CONSTANTS.MODULE_NAME, "mslimit");
                await game.settings.set(CONSTANTS.MODULE_NAME, "translateMsCount", {count: 0, limit:lim});
                await game.settings.set(CONSTANTS.MODULE_NAME, "msCountReset", false);
            }
        }
    });
    await game.settings.register(CONSTANTS.MODULE_NAME, "gmTranslate",{
        name: "SMALLW.GmTranslate",
        hint: "SMALLW.GmTranslateHint",
        scope:"world",
        config:true,
        default:false,
        type:Boolean,
        onChange: () => {
            //@ts-ignore
            foundry.utils.debounce(window.location.reload(), 100)
        }
    });
    game.settings.register(CONSTANTS.MODULE_NAME, "MsConnectionStatus", {
        name: "Connection status with server",
        scope:"client",
        config: false,
        default: false,
        type: Boolean
    });
    game.settings.register(CONSTANTS.MODULE_NAME, "userLanguage", {
        name:"User's Language",
        scope:"client",
        config:false,
        default: "",
        type: String
    });
    game.settings.register(CONSTANTS.MODULE_NAME, "dontDetectLang",{
        name: "SMALLW.DontDetectUserLang",
        hint: "SMALLW.DontDetectUserLangHint",
        scope:"client",
        config:true,
        default:false,
        type:Boolean
    });
    game.settings.register(CONSTANTS.MODULE_NAME, "bilingual", {
        name: "SMALLW.Bilingual",
        hint: "SMALLW.BilingualHint",
        scope:"client",
        config:true,
        default:false,
        type:Boolean
    });
    await getTranslatablelist(true, true, false);
    let langlist = <{deepl:any, microsoft:any; gmid:string}>await game.settings.get(CONSTANTS.MODULE_NAME, "translateTable");
    let gmtrans = await game.settings.get(CONSTANTS.MODULE_NAME, "gmTranslate");
    let worltable = <{deepl:any, microsoft:any; gmid:string}>await game.settings.get(CONSTANTS.MODULE_NAME, "worldtranslateTable");
    let translatorlist = <{deepl:any, microsoft:any; gmid:string}[]>await game.settings.get(CONSTANTS.MODULE_NAME, "canTranslateList");
    let translator = translatorlist.find(i => (i.deepl) && (i.microsoft) && ((<User>game.users?.get(i.gmid)).active));
    if((gmtrans && !!translator)) {
        langlist = worltable;
    }
    let choices = {};
    choices[`default`] = game.i18n.localize("SMALLW.PleaseChoice");
    if(langlist.deepl){
        for(let i = 0; i < langlist.deepl?.length; i++){
            choices[`${langlist.deepl[i]?.language}`] = langlist.deepl[i]?.name + "(deepl)";
        }
    }
    let msStatus = await game.settings.get(CONSTANTS.MODULE_NAME, "MsConnectionStatus");
    if(msStatus || (gmtrans && !!translator)){
        for(let [key, value] of Object.entries(langlist.microsoft?.translation)){
            //@ts-ignore
            choices[`${key}`] = value.name + "(MS)"
        }
    }
    for(let j = 0; j < ORIGINAL_FONT_LIST.length; j++){
        choices[`${ORIGINAL_FONT_LIST[j]?.key}`] = ORIGINAL_FONT_LIST[j]?.name + "(code)"
    }

    await game.settings.register(CONSTANTS.MODULE_NAME, "second-language",{
        name: "SMALLW.SecondLanguage",
        hint: "SMALLW.SecondLanguageHint" ,
        scope:"client",
        config:true,
        default:"default",
        type:String,
        //@ts-ignore
        choices: choices
    });
    game.settings.register(CONSTANTS.MODULE_NAME, "dblFunction", {
        name: "SMALLW.DblClickFunction",
        hint: "SMALLW.DblClickFunctionHint",
        scope:"world",
        config:true,
        default:false,
        type:Boolean,
        onChange: () => {
            //@ts-ignore
            foundry.utils.debounce(window.location.reload(), 100)
        }
    });

    let set = <string>await game.settings.get(CONSTANTS.MODULE_NAME, "second-language")
    if(!choices[set]) {
        await game.settings.set(CONSTANTS.MODULE_NAME, "second-language", "default");
    }

    const users = <User[]>game.users?.contents;
    let bilingal = await game.settings.get(CONSTANTS.MODULE_NAME, "bilingual")
    let send;
    let def = <{id:string, name:string, type:number}[]>[];
    for(let k = 0; k < users.length; k++){
        def.push({
            id:<string>users[k]?.id,
            name:<string>users[k]?.name,
            type:1
        });
    }
    send = [...def]
    if(!game.user?.data.flags[CONSTANTS.MODULE_NAME]){
        await game.user?.setFlag('small-world', "select-users", send)
    }else{
        const arrUsers = <any[]>game.user?.data?.flags[CONSTANTS.MODULE_NAME];
        const arrUsersSelected = arrUsers["select-users"];
        for(let i = 0; i < arrUsersSelected.length; i++){
            let index = send.findIndex(j => {
                return (j.id == arrUsersSelected[i]?.id) && (j.name == arrUsersSelected[i]?.name);
            });
            if(index >= 0){
                send[index] = {...arrUsersSelected[i]}
            }
        }
        if(!bilingal) {
            send.forEach(k => {if(k.type == 2) k.type = 1});
        }
        await game.user.setFlag('small-world', "select-users", send);
    }

    game.user?.setFlag(CONSTANTS.MODULE_NAME, "translatable", true);

    /**
     *  i = 10 , k = 11 or (i = "pass", k = "pasta")
     *  {{#uniqueif i "===" k}}
     *  > false
     */
    Handlebars.registerHelper('uniqueif', function (v1, operator, v2, options) {
        switch (operator) {
            case '==':
                return (v1 == v2) ? options.fn(this) : options.inverse(this);
            case '===':
                return (v1 === v2) ? options.fn(this) : options.inverse(this);
            case '!=':
                return (v1 != v2) ? options.fn(this) : options.inverse(this);
            case '!==':
                return (v1 !== v2) ? options.fn(this) : options.inverse(this);
            case '<':
                return (v1 < v2) ? options.fn(this) : options.inverse(this);
            case '<=':
                return (v1 <= v2) ? options.fn(this) : options.inverse(this);
            case '>':
                return (v1 > v2) ? options.fn(this) : options.inverse(this);
            case '>=':
                return (v1 >= v2) ? options.fn(this) : options.inverse(this);
            case '&&':
                return (v1 && v2) ? options.fn(this) : options.inverse(this);
            case '||':
                return (v1 || v2) ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
        }
    });

	// ========================================================================

	game.settings.register(CONSTANTS.MODULE_NAME, "debug", {
		name: `${CONSTANTS.MODULE_NAME}.setting.debug.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.debug.hint`,
		scope: "client",
		config: true,
		default: false,
		type: Boolean,
	});

	const settings = defaultSettings();
	for (const [name, data] of Object.entries(settings)) {
		game.settings.register(CONSTANTS.MODULE_NAME, name, <any>data);
	}

	// for (const [name, data] of Object.entries(otherSettings)) {
	//     game.settings.register(CONSTANTS.MODULE_NAME, name, data);
	// }
};

class ResetSettingsDialog extends FormApplication<FormApplicationOptions, object, any> {
	constructor(...args) {
		//@ts-ignore
		super(...args);
		//@ts-ignore
		return new Dialog({
			title: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.resetsettings.title`),
			content:
				'<p style="margin-bottom:1rem;">' +
				game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.resetsettings.content`) +
				"</p>",
			buttons: {
				confirm: {
					icon: '<i class="fas fa-check"></i>',
					label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.resetsettings.confirm`),
					callback: async () => {
						await applyDefaultSettings();
						window.location.reload();
					},
				},
				cancel: {
					icon: '<i class="fas fa-times"></i>',
					label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.resetsettings.cancel`),
				},
			},
			default: "cancel",
		});
	}

	async _updateObject(event: Event, formData?: object): Promise<any> {
		// do nothing
	}
}

async function applyDefaultSettings() {
	const settings = defaultSettings(true);
	// for (const [name, settingData] of Object.entries(settings)) {
	//   await game.settings.set(CONSTANTS.MODULE_NAME, name, settingData.default);
	// }
	const settings2 = otherSettings(true);
	for (const [name, settingData] of Object.entries(settings2)) {
		//@ts-ignore
		await game.settings.set(CONSTANTS.MODULE_NAME, name, settingData.default);
	}
}

function defaultSettings(apply = false) {
	return {
		//
	};
}

function otherSettings(apply = false) {
	return {
		debug: {
			name: `${CONSTANTS.MODULE_NAME}.setting.debug.name`,
			hint: `${CONSTANTS.MODULE_NAME}.setting.debug.hint`,
			scope: "client",
			config: true,
			default: false,
			type: Boolean,
		},
	};
}

// export async function checkSystem() {
//   if (!SYSTEMS.DATA) {
//     if (game.settings.get(CONSTANTS.MODULE_NAME, 'systemNotFoundWarningShown')) return;

//     await game.settings.set(CONSTANTS.MODULE_NAME, 'systemNotFoundWarningShown', true);

//     return Dialog.prompt({
//       title: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.nosystemfound.title`),
//       content: dialogWarning(game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.nosystemfound.content`)),
//       callback: () => {},
//     });
//   }

//   if (game.settings.get(CONSTANTS.MODULE_NAME, 'systemFound')) return;

//   game.settings.set(CONSTANTS.MODULE_NAME, 'systemFound', true);

//   if (game.settings.get(CONSTANTS.MODULE_NAME, 'systemNotFoundWarningShown')) {
//     return new Dialog({
//       title: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.systemfound.title`),
//       content: warn(game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.systemfound.content`), true),
//       buttons: {
//         confirm: {
//           icon: '<i class="fas fa-check"></i>',
//           label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.systemfound.confirm`),
//           callback: () => {
//             applyDefaultSettings();
//           },
//         },
//         cancel: {
//           icon: '<i class="fas fa-times"></i>',
//           label: game.i18n.localize('No'),
//         },
//       },
//       default: 'cancel',
//     }).render(true);
//   }

//   return applyDefaultSettings();
// }
