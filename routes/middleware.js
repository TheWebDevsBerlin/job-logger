const loginCheck = () => {
return (req, res, next) => {
if (req.isAuthenticated()) {
next();
} else {
res.redirect('/login');
}
};
};

function showQuote()
{
let quote = [
'I never dreamed about success. I worked for it. — Estee Lauder',
'The crowning fortune of a man is to be born to some pursuit which finds him employment and happiness, whether it be to make baskets, or broadswords, or canals, or statues, or songs.—Ralph Waldo Emerson',
'If the wind will not serve, take to the oars. –Latin Proverb',
'The brick walls are there for a reason. The brick walls are not there to keep us out. The brick walls are there to show us how badly we want something.—Randy Pausch',
'The average person puts only 25% of his energy into his work. The world takes off its hat to those who put in more than 50% of their capacity, and stands on its head for those few and far between souls who devote 100%. —Andrew Carnegie',
'In the middle of difficulty lies opportunity. —Albert Einstein',
'Achievement is largely the product of steadily raising one’s levels of aspirations and expectation. — Jack Nicklaus',
'The harder I practice, the luckier I get.—Gary Player',
'Success seems to be connected to action. Successful people keep moving. They make mistakes, but they never quit. —J.W. Marriot',
'Winning isn’t everything, but wanting to win is. —Vince Lombardi',
'Far and away the best prize that life has to offer is the chance to work hard at work worth doing. —Theodore Roosevelt',
'It is never too late to be what you might have been. —George Eliot',
'Believe in yourself! Have faith in your abilities! Without a humble but reasonable confidence in your own powers you cannot be successful or happy. —Norman Vincent Peale',
'Wanting to be someone else is a waste of the person you are.—Marilyn Monroe',
'The only way to do great work is to love what you do. If you haven’t found it yet, keep looking. Don’t settle.—Steve Jobs',
'Don’t confuse having a career with having a life. — Hillary Clinton',
'A mind troubled by doubt cannot focus on the course to victory. —Arthur Golden',
'Excellence is to do a common thing in an uncommon way. —Booker T. Washington',
'All our dreams can come true, if we have the courage to pursue them. —Walt Disney'
];
let Pick = Math.floor(Math.random() * (quote.length));
return quote[Pick];
}

module.exports = {
  loginCheck: loginCheck, 
  showQuote: showQuote
};