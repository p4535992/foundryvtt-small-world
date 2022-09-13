/**
 * @author      toshi (https://github.com/k08045kk)
 * @license     MIT License | https://opensource.org/licenses/MIT
 * @version     2
 * @since       1 - 20211215 - 初版
 * @since       2 - 20220328 - fix 「'」「"」をタグ名・属性名に使用できる
 * @since       2 - 20220328 - fix 全角スペースをタグ名・属性名に使用できる
 * @since       2 - 20220328 - fix 属性の途中に「"'」を含むことがある
 * @see         https://www.bugbugnow.net/2021/12/tokenize-parse-html.html
 * @param {string} html - 生テキストのHTML
 * @param {Object} [option={}] - オプション
 * @param {boolean} option.trim - タグ間の空白を削除する
 * @return {string[]} - 分解した文字列
 */
export function htmlTokenizer(html:string, option:any={}) {
    const stack = <string[]>[];

    let lastIndex = 0;
    const findTag = /<[!/A-Za-z][^\t\n\f\r />]*([\t\n\f\r /]+[^\t\n\f\r /][^\t\n\f\r /=]*([\t\n\f\r ]*=([\t\n\f\r ]*("[^"]*"|'[^']*'|[^\t\n\f\r >]*)))?)*[\t\n\f\r /]*>/g;
    for (let m; m=findTag.exec(html); ) {
      if (lastIndex < m.index) {
        let text = <string>html.substring(lastIndex, m.index);
        if (option.trim) {
            text = text.trim();
        }
        if (text.length > 0) {
            stack.push(text);
        }
      }
      lastIndex = findTag.lastIndex;

      let tag = m[0];
      if (option.trim) {
        tag = tag.trim();
      }
      stack.push(tag);
    }
    return stack;
}
