# Prosper Loan Visualization
##Summary
This visualization depicts the rise and fall of consumer debt as impacted by the 2008 financial crisis. Specifically, Subprime lending is isolated as this category of lending was villainized as the root-cause. Through a storyboard type approach, the viewer is provided with context into consumer debt and the impact of the financial crisis.

The data source comes from Prosper, was last updated on March 11, 2014, and provides information on ~114,000 loans which are used to make inferences about the entire debt market.
##Design
From my initial sketch, I knew I wanted to use a line-chart to show the changes in consumer debt over time. Originally, I had thought about incorporating a histogram as a way to depict debt-levels across the various credit categories, but I thought it would distract from the main story. I knew I wanted to set-up the visualization like a story-board, and follow more of a martini-glass narrative structure where the user would be able to do some exploration of their own after the main story had completed. Some of the design choices include:

###Before Feedback
* Using pastel colours for the series as brighter colours may provide too much contrast.
* Incorporating the solid black-bar to show when the crisis occured, which gives the view a "before and after" reference point.
* Reduced the number of credit categories to 4, which makes it easier to view overall patterns without clutter.
* Allow the user to click-through the story at their own rate, rather than advancing at set intervals.
* Providing annotations to help guide the story.

###After Feedback
* Changed the subprime series colour to black to differentiate it from the other colours.
* Fixed issues with the Interest Rate aggregations.
* Added a quick "pop-up" when the story ends to direct users to explore on their own.
* Changed the x-axis to be on a 45 angle, instead of completely horizontal so it would fit more.
* Added a replay button
* The vertical blackbar used as a reference line will not show-up on versions of Safari (unfortunately, I don't have a solution for this).

##Feedback
###Marcy Weston Feedback

**What do you notice in the visualization?**

I like the simplicity of the visualization. It's very clean. I like the story and the animation.

The colours of the subprime and acceptable lines are a little too close - I find them difficult to tell apart.

A refresh/replay button would be helpful as I'd like to review the data

**What questions do you have about the data?**

Until I Googled what Prosper was, I couldn't understand the context of the data completely.   I could obviously see the differences and relationships in the data. The data made more sense when I knew Prosper was a lending company.

**What relationships do you notice?**

There wasn't a large difference in the number of loans given by credit score prior to Q4 2009. After Q4 2009, lending for Excellent, Good and Acceptable are similar until Q3 2013 when it seems those with Excellent credit scores stopped asking for more debt while those that were Good and Acceptable continued to rise.

**What do you think is the main takeaway from this visualization?**

The amount of debt is terrifying. Those with Sub Prime credit scores stopped getting credit only for everyone else to start borrowing way more than before. It won't be those with current sub prime credit scores that cause the next financial crisis.

**Is there something you don’t understand in the graphic?**

No

###Michael Hogan Feedback

**What do you notice in the visualization?**

Interest rates have been falling since 2011 while at the same time the total number of loans and total amount loaned have increased significantly for everyone with an acceptable credit score or higher. Total number of loans and amount loaned are 3-4 times higher than before the financial crisis of 2007 when banks were targeting sub prime credit scores for new loans, now they are targeting less risky, higher credit scores, but lending substantially more.

The x-axis becomes squished when the story progresses.

**What questions do you have about the data?**

I would like to see more date into 2014 and to present to see if the drop in loans for Q1 2014 is a downward trend of the market correcting itself or is it just a seasonal trend like seen Q1 2013 and it will trend upwards Q2-4.

**What relationships do you notice?**

Amount loaned and number of new loans are related and move in the same direction, however since 2007, it looks like the debt has grown greater than the number of new loans which mean the average person is carrying more debt.

**What questions do you have about the data?**

N/A

**What do you think is the main takeaway from this visualization?**

Consumer debt is growing at an alarming rate

**Is there something you don’t understand in the graphic?**

I don’t understand how you made data look schmexy

###Hatim Ouhbi Feedback

I like what you did with the vizualisation, it turned numbers that may seem boring to a lot of people into a story. the storytelling style made it very interesting and so easy to understand. It clearly shows that unless we change something, the next financial crisis will be a devastating one. In ADKAR words, the vizualisation created awareness and desire to make changes.

**Looking at the graphs, my questions would be:** 

What happened in 2013 Q4? all graphs are showing a decline

Not sure if this is the kind of feedback you're looking for but relationships I notice are
when interest rates decreased in Q1 2013, number of loans and amounts loaned have increased
the amounts loaned and number of loans have very similar trends

##Resources

**Discussion on how much data d3.js can handle**

https://www.quora.com/Does-D3-js-work-efficiently-on-massive-amounts-of-data-200-million-rows-with-at-least-a-dozen-columns

**US Credit Score Categories**

http://www.credit.org/what-is-a-good-credit-score-infographic/

**Sanity check when struggling with version issue**

http://annapawlicka.com/pretty-charts-with-dimple-js/

**Adding a vertical line to Dimplejs**

http://stackoverflow.com/questions/26358059/how-to-draw-a-vertical-line-with-dimple
