import BlockManager from "./BlockManager";
import ListenersManager from "./ListenersManager";

/**
 * 创建一个浏览器history api的history对象
 * @param {*} options 
 */
export default function createBroserHistory(options={}) {
    const {
        basename = "",
        forceRefresh = false,
        keyLength = 6,
        getUserConfirmation = (message, callback) => callback(true)
    } = options
    const listenersManager = new ListenersManager();
    const blockManager = new BlockManager(getUserConfirmation);
    const location = createLocation(basename);

    function go(step) {
        window.history.go(step);
    }

    function goBack() {
        go(-1);
    }

    function goForwar() {
        go(1);
    }
    /**
     * 传入pathname和数据
     * @param {*} pathname 
     * @param {*} state 
     */
    function push(pathname, state) {
        const pathInfo = handlePathname(pathname, state, basename);
        const location = createLocationFromPathInfo(pathInfo, basename);
        blockManager.triggerBlock(location, "PUSH", () => {
            window.history.pushState({
                key: getRandomStr(keyLength),
                state: pathInfo.state
            }, null, pathInfo.path)
            if (forceRefresh) {
                window.location.href = pathInfo.path
            }
            listenersManager.triggerListeners(location, "PUSH");
            history.action = "PUSH";
            history.location = location;
            history.length = window.history.length;
        })
    }

    function replace(pathname, state) {
        const pathInfo = handlePathname(pathname, state, basename);
        const location = createLocationFromPathInfo(pathInfo, basename);
        blockManager.triggerBlock(location, "REPLACE", () => {
            window.history.replaceState({
                key: getRandomStr(keyLength),
                state: pathInfo.state
            }, null, pathInfo.path)
            if (forceRefresh) {
                window.location.href = pathInfo.path
            }
            listenersManager.triggerListeners(location, "REPLACE");
            history.action = "REPLACE";
            history.location = location;
        })
    }
    //产生随机字符串

    function getRandomStr(num) {
        return Math.random().toString(36).substr(2, num)
    }

    function handlePathname(pathname, state, basename) {
        if (typeof pathname === "string") {
            if (pathname.charAt(0) !== "/") {
                pathname = "/" + pathname;
            }
            return {
                path: basename + pathname,
                state: state,
            }
        } else if (typeof pathname === "object") {
            let path = pathname.path;
            if (path.charAt(0) !== "/") {
                pathname = "/" + pathname;
            }
            let {
                search,
                hash
            } = pathname;
            if (search.charAt(0) !== "?") {
                search = "?" + search;
            }
            if (hash.charAt(0) !== "#") {
                hash = "#" + hash
            }
            return {
                path: basename + path + search + hash,
                state: pathname.state,
            }
        }
    }
    //listen方法，调用listenerManager中的addListen方法
    function listen(fn) {
        return listenersManager.addListen(fn);
    }
    //监听popState事件，在上面绑定监听或者阻塞
    function addDomListener() {
        window.addEventListener("popstate", () => {
            const location = createLocation(basename);
            blockManager.triggerBlock(location, "POP", () => {
                listenersManager.triggerListeners(location, "POP");
                history.location = location;
            })
        })
    }
    addDomListener();
    //产生阻塞
    function block(promt) {
        return blockManager.block(promt);
    }
    //createHref函数
    function createHref(location) {
        return basename + location.pathname;
    }
    const history = {
        action: "POP",
        location,
        length: window.history.length,
        go,
        goBack,
        goForwar,
        push,
        listen,
        replace,
        block,
        createHref,
    }
    return history;
}

function createLocation(basename) {
    let pathname = window.location.pathname;
    const reg = new RegExp(`^${basename}`);
    pathname = pathname.replace(reg, "");
    const location = {
        hash: window.location.hash,
        search: window.location.search,
        pathname,
    }
    let state, historyState = window.history.state;
    if (historyState === null) {
        state = undefined;
    } else if (typeof historyState !== "object") {
        state = historyState;
    } else {
        if ("key" in historyState) {
            location.key = historyState.key;
            state = historyState.state;
        }
    }
    location.state = state;
    return location;
}
//从pathInfo中产生出一个location
function createLocationFromPathInfo(pathInfo, basename) {
    let pathname = pathInfo.path.replace(/[#?].*$/, "");
    let reg = new RegExp(`^${basename}`);
    pathname = pathname.replace(reg, "");
    let questionIndex = pathInfo.path.indexOf("?");
    let hashIndex = pathInfo.path.indexOf("#");
    let search;
    if (questionIndex === -1 || questionIndex > hashIndex) {
        search = ""
    } else {
        search = pathInfo.path.substr(questionIndex, hashIndex)
    }
    let hash;
    if (hashIndex === -1) {
        hash = "";
    } else {
        hash = pathInfo.path.substr(hashIndex);
    }
    return {
        hash,
        pathname,
        search,
        state: pathInfo.state
    }
}
