export default class QueryProcessorState {
    
    _isQueryBeingProcessed = false

    encodeIdToURL(id) {
        id = id.replace(new RegExp("%", 'g'), "%25")
        id = id.replace(new RegExp("/", 'g'), "%2F")
        id = id.replace(new RegExp("\\\\", 'g'), "%5C")
        id = id.replace(new RegExp("=", 'g'), "%3D")
        id = id.replace(new RegExp("\\?", 'g'), "%3F")
        id = id.replace(new RegExp(":", 'g'), "%3A")
        id = id.replace(new RegExp(";", 'g'), "%3B")
        id = id.replace(new RegExp("\\[", 'g'), "%5B")
        id = id.replace(new RegExp("\\]", 'g'), "%5D")
        id = id.replace(new RegExp("\\^", 'g'), "%5E")
        id = id.replace(new RegExp("`", 'g'), "%60")
        id = id.replace(new RegExp("{", 'g'), "%7B")
        id = id.replace(new RegExp("\\|", 'g'), "%7C")
        id = id.replace(new RegExp("}", 'g'), "%7D")
        id = id.replace(new RegExp("~", 'g'), "%7E")
        id = id.replace(new RegExp(" ", 'g'), "%20")
        id = id.replace(new RegExp("&", 'g'), "%26")
        id = id.replace(new RegExp("\\$", 'g'), "%24")
        id = id.replace(new RegExp("@", 'g'), "%40")
        id = id.replace(new RegExp("#", 'g'), "%23")
        id = id.replace(new RegExp("\\.", 'g'), "%2E")
        id = id.replace(new RegExp(",", 'g'), "%2C")
        id = id.replace(new RegExp("!", 'g'), "%21")
        id = id.replace(new RegExp("<", 'g'), "%3C")
        id = id.replace(new RegExp(">", 'g'), "%3E")
        id = id.replace(new RegExp("\\(", 'g'), "%28")
        id = id.replace(new RegExp("\\)", 'g'), "%29")
        id = id.replace(new RegExp("'", 'g'), "%27")
        id = id.replace(new RegExp('"', 'g'), "%22")

        return id
    }
}