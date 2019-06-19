import 'dotenv/config';
import { IgApiClient } from '../src';

(async () => {
  const ig = new IgApiClient();
  ig.state.generateDevice(process.env.IG_USERNAME);
  ig.state.proxyUrl = process.env.IG_PROXY;
  const auth = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
  const targetUser = await ig.user.searchExact('username'); // getting exact user by login
  const reelsFeed = ig.feed.reelsMedia({ // working with reels media feed (stories feed)
    userIds: [targetUser.pk] // you can specify multiple user id's, "pk" param is user id
  });
  const storyItems = await reelsFeed.items(); // getting reels, see "account-followers.feed.example.ts" if you want to know how to work with feeds
  if (storyItems.length === 0) // we can check items length and find out if user does not have any story to watch
    return false;
  const seenResult = await ig.story.seen([storyItems[0]]); // now we can mark story as seen using "story" service, you can specify multiple stories, in this case we watching only first story
  console.log(seenResult); // seenResult.status should be "ok"
})();
