import { config } from 'dotenv';
import passport from 'passport';
import FacebookTokenStrategy from 'passport-facebook-token';

import MockedStrategy from '../../lib/mockStrategy';

// Initialize the dotenv package to handle all environment variables
config();

// Create a placeholder variable to store strategy to be exported
let strategy;

// Define callback to be passed to successful strategies
const strategyCallback = async (accessToken, refreshToken, profile, done) => {
  // Get access to the user details and send it to the controller
  try {
    const user = {
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      email: profile.emails[0].value,
      password: profile.id,
      account_type: profile.provider
    };
    done(null, user);
  } catch (error) {
    done(error, false, error.message);
  }
};

// Configure the facebook passport strategy and pass the callback as an handler

passport.use(
  new FacebookTokenStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET
    },
    strategyCallback
  )
);

/* For testing purposes configure a mock strategy

These articles guided in implementing the mock strategy
https://gist.github.com/mweibel/5219403
https://medium.com/chingu/mocking-passport-githubstrategy-for-functional-testing-33e7ed4f9aa3
*/
passport.use(new MockedStrategy('facebook', strategyCallback));

// Configure which strategy gets used based on the environment
if (process.env.NODE_ENV === 'test') {
  strategy = 'facebook';
} else {
  strategy = 'facebook-token';
}

module.exports = strategy;