import React from 'react';
import SampleQuery from '../../../components/SampleQuery';
import { Trans } from 'react-i18next';

export default function SubQuery() {
  return (
    <div>
      <p>
        <Trans i18nKey="Contents.P1">
          NRQL does not support the type of joins used in traditional SQL
          databases. However, you can write nested aggregation queries that
          resemble sub queries. This allows you to answer questions such as:
        </Trans>
      </p>
      <ul>
        <Trans i18nKey="Contents.P2">
          <li>
            How many requests per minute did my application handle, and what was
            the maximum rate of requests per minute in the last hour?
          </li>
          <li>
            What is the average CPU usage of all my servers, and which specific
            servers are over 90%?
          </li>
          <li>
            What percentage of all user sessions bounced immediately (i.e. only
            one PageView in the session)?
          </li>
        </Trans>
      </ul>

      <p>
        <Trans i18nKey="Contents.P3">
          Let's explore each of these use cases in more detail.
        </Trans>
      </p>

      <h2>
        <Trans i18nKey="Contents.H1">Example 1 - Max RPM for Last Hour</Trans>
      </h2>
      <p>
        <Trans i18nKey="Contents.P4">
          First we count the number of transactions per minute over the last
          hour. There is nothing new here. This returns 60 data points on a
          graph:
        </Trans>
      </p>
      <SampleQuery
        nrql="SELECT count(\*) **AS rpm** FROM Transaction TIMESERIES 1 MINUTE"
        fallbacknrql="SELECT count(*) AS apicalls FROM Public_APICall TIMESERIES 1 minute"
        span="12"
      />
      <p>
        <Trans i18nKey="Contents.P5">
          Now, in order to find the maximum value reported across that period,
          we wrap the query in parentheses, and use <code>SELECT ... FROM</code>{' '}
          like this: <code>SELECT z FROM (SELECT x FROM y)</code>
        </Trans>
      </p>
      <SampleQuery
        nrql="**SELECT max(rpm) FROM (**SELECT count(\*) **AS rpm** FROM Transaction TIMESERIES 1 MINUTE**)**"
        fallbacknrql="SELECT max(apicalls) FROM (SELECT count(*) AS apicalls FROM Public_APICall TIMESERIES 1 minute)"
        span="6"
        chartType="table"
      />

      <h2>
        <Trans i18nKey="Contents.H2">
          Example 2 - Servers with High CPU Load
        </Trans>
      </h2>
      <p>
        <Trans i18nKey="Contents.P6">
          This example uses data from New Relic Infrastructure. Sometimes you
          only want to see hosts whose CPU has, on average, exceeded a certain
          percentage. If you ask NRQL for the <code>average(cpuPercent)</code>{' '}
          you get a list of hosts with the highest average CPU percent. But you
          cannot simply add a <code> WHERE cpuPercent {'>'} 90 </code> to limit
          this to only hosts running at 90% or above, because this would remove
          the data before calculating the average.{' '}
        </Trans>
      </p>
      <p>
        <Trans i18nKey="Contents.P7">
          But this can be solved with nested aggregation! By asking for{' '}
          <code>average(cpuPercent)</code> in the sub query, we get the list of
          hosts and their average CPU. Now, in the outer query we can filter to
          only results that were {'>'} x%. Happy days!{' '}
          <em>
            (Tip: You may need to adjust the threshold of this query to work
            with your hosts' CPU. We've set it to 20% here.)
          </em>
        </Trans>
      </p>
      <SampleQuery
        nrql="SELECT hostname, **cpu** FROM (SELECT average(cpuPercent) **AS cpu** FROM SystemSample FACET hostname) **WHERE cpu > 20**"
        fallbacknrql="SELECT api, slowAPIDuration FROM (SELECT average(duration) AS slowAPIDuration FROM Public_APICall FACET api) WHERE slowAPIDuration > 1"
        span="12"
        chartType="table"
      />

      <h2>
        <Trans i18nKey="Contents.H3">Example 3 - Session Bounces</Trans>
      </h2>
      <p>
        <Trans i18nKey="Contents.P8">
          We are often asked how to calculate bounce rate on front-end
          monitoring. This refers to sessions that view a single page, and
          "bounce" away before visiting more pages. With nested aggregation, we
          can achieve this. Our inner query counts the PageViews, grouping them
          by session. The result set passed to the outer query is a list of all
          sessions and how many pages each viewed. The outer query then
          calculates the percentage of sessions in which the count is 1 (this
          indicates a "bounced session", because they only viewed a single
          page).{' '}
        </Trans>
      </p>
      <SampleQuery
        nrql="SELECT percentage(count(\*), **WHERE sessionLength = 1**) FROM (SELECT count(\*) **AS sessionLength** FROM PageView FACET session)"
        fallbacknrql="SELECT percentage(count(*), WHERE slowAPIDuration > 1) FROM (SELECT average(duration) AS slowAPIDuration FROM Public_APICall FACET api)"
        span="12"
      />

      <h2>
        <Trans i18nKey="Contents.H4">Lesson Summary</Trans>
      </h2>
      <p>
        <Trans i18nKey="Contents.P9">
          Well done! You have now learned all the amazing functionality of NRQL
          covered in this course. You truly are a NRQL wizard!
        </Trans>
      </p>
      <p>
        <Trans i18nKey="Contents.P10">
          If you have further questions or encounter problems, feel free to
          contact New Relic support via{' '}
        </Trans>
        <a href="https://support.newrelic.com" target="_blank" rel="noreferrer">
          support.newrelic.com
        </a>{' '}
        <Trans i18nKey="Contents.P11">
          You're also welcome to share your experience with our online community
          at{' '}
        </Trans>
        <a href="https://discuss.newrelic.com" target="_blank" rel="noreferrer">
          discuss.newrelic.com
        </a>
        .
      </p>
    </div>
  );
}
