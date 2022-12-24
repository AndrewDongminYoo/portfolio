import { MetaError, MetaTag, Repository } from "../types/repos.types";

const initFacebook = async () => {
    await window.FB.init({
        appId: 1179656956170597,
        xfbml: true,
        version: 'v15.0'
    });
}

export const setMetaTagsOnRepo = async (repo: Repository): Promise<Repository> => {
    return new Promise(initFacebook)
    .then(()=> {
        window.FB.api('/', 'POST', {
            scrape: true,
            id: repo.html_url,
            access_token: process.env.FB_TOKEN,
        },
            (response: MetaTag | MetaError) => {
                if (response && "error" in response) {
                    () => { return }
                } else if (response) {
                    repo["meta_tags"] = response as MetaTag;
                }
            })
    }).then(()=>{return repo});
}

export const facebookApiOnload = async (repos: Repository[]): Promise<Repository[]> => {
    await initFacebook();
    await repos.map(async (repo: Repository) => {
        return await setMetaTagsOnRepo(repo)
    })
    return await Promise.all(repos);
}
