//targets the div where profile info appears
const overview = document.querySelector(".overview");
const username = "sheeshalicia";
const repoList = document.querySelector(".gh-repo-list");
const repoBoxes = document.querySelector(".gh-repos");
const repoData = document.querySelector(".gh-repo-data");
const backToReposButton = document.querySelector(".gh-view-repos");
const filterInput = document.querySelector(".gh-filter-repos");

//this async function fetches information from my github profile
const getProfileInfo =  async function () {
    const gitUserInfo = await fetch(`https://api.github.com/users/${username}`);
    const data = await gitUserInfo.json();
    //log out the response to the console and call your function
    //test console.log(data); //this allows us to see something in the console when we run the function
    displayProfileInfo(data);
};

getProfileInfo();

//this async function displays the fetched info on the page
const displayProfileInfo = async function (data) {
    const div = document.createElement("div");
    div.classList.add("gh-user-info");
    //the following adds information pulled from the getProfileInfo data (above) using chosen properties
    div.innerHTML =
    `<figure>
        <img alt="user avatar" src=${data.avatar_url} />
    </figure>
    <div>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Bio:</strong> ${data.bio}</p>
        <p><strong>Location:</strong> ${data.location}</p>
        <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
    </div>` ;

    overview.append(div);
    displayRepos();
};

//this async function fetches and displays my repos
const displayRepos = async function (){
    const fetchRepos = await fetch (`https://api.github.com/users/${username}/repos?sort=updated$per_page=100`);
    const repoData = await fetchRepos.json();
displayRepoInfo(repoData);
};

//this function displays each repo as a list (boxes)
const displayRepoInfo = function (repos) {
    filterInput.classList.remove("hide");
    //loop and create a list item for each repo with a class and name
    for (const repo of repos) {
        const repoItem = document.createElement("li");
        repoItem.classList.add("repo");
        repoItem.innerHTML = `<h3> ${repo.name}</h3>`;
        repoList.append(repoItem);
    }
};

repoList.addEventListener("click", function (e) {
    if (e.target.matches("h3")){
        const repoName = e.target.innerText;
        getRepoInfo(repoName)
    }
});

const getRepoInfo = async function (repoName) {
    const fetchInfo = await fetch (`https://api.github.com/repos/${username}/${repoName}`);
    const repoInfo = await fetchInfo.json();
    console.log(repoInfo);
    //get the languages from the above data
    const fetchLanguages = await fetch (repoInfo.languages_url);
    const languageData = await fetchLanguages.json();
    console.log(languageData);
    //make a list of the languages by looping through the languageData object above
    const languages = [];
    for (const language in languageData) {
        languages.push(language);
        displayRepoLanguages(repoInfo, languages);
    }
};

//this function displays the specific repo information
const displayRepoLanguages = function (repoInfo, languages) {
    repoData.innerHTML = "";
    repoData.classList.remove("hide");
    repoBoxes.classList.add("hide");
    const div = document.createElement ("div");
    div.innerHTML = `
    <h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
    `;
    repoData.append(div);
    backToReposButton.classList.remove("hide");
};

//add a click event to the "back to repos" button
backToReposButton.addEventListener("click", function () {
    repoData.classList.add("hide");
    repoBoxes.classList.remove("hide");
    backToReposButton.classList.add("hide");
});

//add an input event to the search box
filterInput.addEventListener("input", function (e) {
    const searchText = e.target.value;
    const repos = document.querySelectorAll(".repo");
    const lowercaseSearchText = searchText.toLowerCase();

    //Loop through each repo inside your repos element
    for (const repo of repos) {
        //create a variable and assing in to the lowercase value of the innertext of each repo
        const lowercaseRepoText = repo.innerText.toLowerCase();
        //check to see if the lowercase repo text includes the lowercase search text, and show it if it does
        if (lowercaseRepoText.includes(lowercaseSearchText)){
            repo.classList.remove("hide")
        } else {
            repo.classList.add("hide");
        }
    }
});

