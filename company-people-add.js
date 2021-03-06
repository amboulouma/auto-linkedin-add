// 1. Go to https://www.linkedin.com/company/{COMPANY_NAME}/people/
// 2. Make sure your LinkedIn is in English
// 3. Modify the constants to your liking
// 4. Open chrome dev tools and paste this script or add it as a snippet
// Comment: Edit on the 26.07.2020

(async () => {
  // maximum amount of connection requests
  const MAX_CONNECTIONS = 200;
  // time in ms to wait before requesting to connect
  const WAIT_TO_CONNECT = 2000;
  // time in ms to wait before new employees load after scroll
  const WAIT_AFTER_SCROLL = 3000;
	
  // keywords to filter employees in specific positions
  const POSITION_KEYWORDS = [
    "director",
    "vc",
    "cto",
    "ceo",
    "president",
    "head"
  ];
    
  function getButtonElements() {
    return [
      ...document.querySelectorAll(
        'button[data-control-name="people_profile_card_connect_button"]'
      ),
    ].filter((button) => {
      const cardInnerText = button.offsetParent.innerText.split("\n");
      const positionIndex = cardInnerText.length > 3 ? 3 : 1;
      const position = cardInnerText[positionIndex];
      return POSITION_KEYWORDS.some((p) => position.match(new RegExp(p, "gi")));
    });
  }

  async function connect(button) {
    return new Promise((resolve) => {
      setTimeout(() => {
        button.click();
        resolve();
      }, WAIT_TO_CONNECT);
    });
  }

  async function* getConnectButtons() {
    while ((buttons = getButtonElements()).length > 0) {
      yield* buttons;
      await loadMoreButtons();
    }
  }

  async function loadMoreButtons() {
    console.log("⏬ Scrolling..");
    await Promise.resolve(window.scrollTo(0, document.body.scrollHeight));
    return new Promise((resolve) => setTimeout(resolve, WAIT_AFTER_SCROLL));
  }

  // <--> //

  console.log("⏳ Started connecting, please wait.");
  try {
    var connections = 0;
    const buttonsGenerator = getConnectButtons();
    while (
      connections < MAX_CONNECTIONS &&
      !(next = await buttonsGenerator.next()).done
    ) {
      const button = next.value;
      await connect(button);
      connections++;
    }
    console.log(
      `✅ Done! Successfully requested connection to ${connections} people.`
    );
  } catch {
    console.log(
      `⛔ Whoops, looks like something went wrong.
		Please go to https://github.com/amboulouma/auto-linkedin-add/company-people-add.js and follow the instructions.`
    );
  }
})();
