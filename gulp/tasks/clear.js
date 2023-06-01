// delete the build folder
export const clear = () => {
    return app.plugins.del(app.path.clean);
}