export const RedirectUrl = (uri) =>
{
    return {
        type: "SET_REDIRECT_URL",
        uri: uri
    }
}

export const ResetRedirectUrl = () =>
{
    return {
        type: "RESET_REDIRECT_URL"
    }
}

export const EnableLoading = () =>
{
    return {
        type: "ON_LOADING"
    }
}

export const DisableLoading = () =>
{
    return {
        type: "OFF_LOADING"
    }
}

export const LoadOnlyArticle = (datos) =>
{
    return {
        type: "LOAD_ONLYARTICLE",
        data: datos
    }
}

export const PendingUrlAfterAction = (datos) =>
{
    return {
        type: "REDIRECT_AFTERACTION",
        data: datos
    }
}

export const HandleChange = data =>
{
    return {
        type: "CHANGE_DATA_VALUE_APP",
        data: data
    }
}