import browsersync from "browser-sync";   // local server
import ifPlugin from "gulp-if";           // boolean branching for tasks
import newer from "gulp-newer";           // update check for files
import replace from "gulp-replace";       // searching and replacement
import del from "del";                    // deliting files
import plumber from "gulp-plumber";       // error processing
import notify from "gulp-notify";         // windows messages


// export for use in separate tasks
export const plugins = {
    browsersync,
    if: ifPlugin,
    newer,
    replace,
    del,
    plumber,
    notify,

    // show error notification in windows
    notifyError(title) {
        return (
            this.plumber(
                this.notify.onError({
                    title: title,
                    message: "Error: <%= error.message %>"
                })
            )
        )
    }
}