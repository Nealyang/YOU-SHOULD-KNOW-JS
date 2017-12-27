/**
 *
 * @authors  Nealyang(nealyang231@gmail.com)
 * @date    2017/12/26
 * @version 1.0.0
 */
function HashTable() {
    var table = [];
    var loseloseHashCode = function (key) {
        var hash = 0;
        for(var i = 0,length = key.lenght;i<length;i++){
            hash += key.charCodeAt(i);
        }
        return hash % 37;
    };
    this.get = function(key) {
        var position = loseloseHashCode(key);
        if (table[position] !== undefined){ //{8}
            if (table[position].key === key) { //{9}
                return table[position].value; //{10}
            } else {
                var index = ++position;
                while (table[index] === undefined
                || table[index].key !== key){ //{11}
                    index++;
                }
                if (table[index].key === key) { //{12}
                    return table[index].value; //{13}
                }
            } }
        return undefined; //{14}
    };
}