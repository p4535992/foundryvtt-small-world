export class Code {
    static b64encode(...char){
        return new Promise(resolve => {
          const reader = new FileReader();
          reader.onload = () => {
            const offset = (<string>reader?.result)?.indexOf(",") + 1;
            resolve(reader?.result?.slice(offset));
          };
          reader.readAsDataURL(new Blob(char));
        });
    }

    static async b64decode(char){
        const response = await fetch(`data:text/plain;base64,` + char);
        return await response.text();
    }

    static async encodechar(char){
        if(char != ""){
            let a = <string>await Code.b64encode(char)
            var orig = a.split('');
            var newword = <number[]>[];
            var result = <string[]>[];
            let asciiLimit = 126;
            let asciiExclude = 32;
            let asciiOffset = asciiLimit - asciiExclude + 1;
            let getRangeValue = function(code:number, offs:number){
                return (code - asciiExclude + offs) % asciiOffset + asciiExclude
            };

            for (let i = 0; i < orig.length; i++){
                let offs = Math.round(Math.pow(i, 2) + (Math.pow(i, 3) / (i + 1)));
                let code = <number>orig[i]?.charCodeAt(0);
                if(i % 2 == 0){
                    newword.push(getRangeValue(code, offs));
                }else{
                    newword.unshift(getRangeValue(code, offs));
                }
            }

            for (let j = 0; j < newword.length; j++){
                let keyNumber = String(newword[j]).charAt(String(newword[j]).length - 1);
                let prevCode = <number>newword[j];
                result.push(String.fromCharCode(<number>newword[j]));
                for (let k = 0; k < keyNumber.length; k++){
                    prevCode = getRangeValue(prevCode + Math.pow(prevCode, k), 0);
                    result.push(String.fromCharCode(prevCode));
                }
            }
            return result.join("");
        }else{
            return ""
        }
    }

    static async decode(char){
        if(char != ""){
            var word = String(char).split("")
            var w1 = <number[]>[];
            var w2 = <string[]>[];

            let asciiLimit = 126;
            let asciiExclude = 32;
            let asciiOffset = asciiLimit - asciiExclude + 1;

            let getOriginalCode = function(v, offs){
                if((offs - asciiExclude) % asciiOffset + asciiExclude >= asciiOffset){
                    if(v - (((offs - asciiExclude) % asciiOffset + asciiExclude) % asciiOffset) < asciiExclude){
                        return v - (((offs - asciiExclude) % asciiOffset + asciiExclude) % asciiOffset) + asciiOffset;
                    }else{
                        return v - (((offs - asciiExclude) % asciiOffset + asciiExclude) % asciiOffset);
                    }
                }else{
                    if(v - ((offs - asciiExclude) % asciiOffset + asciiExclude) < asciiExclude){
                        return v - ((offs - asciiExclude) % asciiOffset + asciiExclude) + asciiOffset;
                    }else{
                        return v - ((offs - asciiExclude) % asciiOffset + asciiExclude);
                    }
                }
            }

            for (let i = 0; i < word.length; i++){
                let code = <number>word[i]?.charCodeAt(0);
                w1.push(code);
                i += parseInt(String(code).charAt(String(code).length - 1));
            }

            let length = w1.length;
            for(let j = 0; j < length; j++){
                if(j % 2){
                    var v = w1.pop();
                }else{
                    var v = w1.shift();
                }
                let foo = length - j - 1;
                let offs = Math.round(Math.pow(foo, 2) + (Math.pow(foo, 3) / (foo + 1)));

                w2.unshift(String.fromCharCode(getOriginalCode(v, offs)));
            }
            return Code.b64decode(w2.join(""));
        }else{
            return ""
        }
    }
}
