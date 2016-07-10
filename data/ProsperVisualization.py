# -*- coding: utf-8 -*-
"""
Created on Sun Jul  3 12:17:06 2016
@author: joshWeston
Purpose: Preprocessing work to reduce filesize for prosper loan visualization.
"""

import pandas as pd
import datetime

df = pd.read_csv('prosperLoanData.csv')

#Date ranges
#lowDate = datetime.date(2007, 1, 1)
#highDate = datetime.date(2011, 1, 1)

#Convert to datetime
df['LoanOriginationDate'] = pd.to_datetime(df['LoanOriginationDate'])

#Carve-out ranges
#df = df[df['LoanOriginationDate'] >= lowDate]
#df = df[df['LoanOriginationDate'] < highDate]

#Remove unnecessary columns
exclude = ['ListingKey', 'ListingNumber', 'ListingCreationDate', 'CreditGrade',
           'ClosedDate', 'EstimatedEffectiveYield', 'EstimatedLoss',
           'EstimatedReturn', 'ProsperRating (numeric)', 'ProsperRating (Alpha)', 
           'CurrentlyInGroup', 'GroupKey', 
           'DateCreditPulled', 'FirstRecordedCreditLine', 'CurrentCreditLine',
           'OpenCreditLine', 'TotalCreditLinespast7years', 'InquiriesLast6Months',
           'TotalInquiries', 'DelinquenciesLast7Years', 'PublicRecordsLast10Years',
           'PublicRecordsLast12Months', 'BankcardUtilization',
           'AvailableBankcardCredit', 'TotalTrades',
           'TradesNeverDelinquent (percentage)', 'TradesOpenedLast6Months',
           'IncomeVerifiable', 'LoanKey', 'TotalProsperLoans',
           'TotalPropserPaymentsBilled', 'OnTimeProsperPayments',
           'ProsperPaymentsLessThanOneMonthLate', 'ProsperPaymentsOneMonthPlusLate',
           'ProsperPrincipalBorrowed', 'ProsperPrincipalOutstanding',
           'ProsperPrincipalOutstanding', 'LoanFirstDefaultedCycleNumber',
           'LoanMonthsSinceOrigination', 'LoanNumber', 'MemberKey',
           'LP_CustomerPayments', 'LP_CustomerPrincipalPayments', 
           'LP_InterestandFees', 'LP_ServiceFees', 'LP_CollectionFees',
           'LP_GrossPrincipalLoss', 'LP_NetPrincipalLoss', 
           'LP_NonPrincipalRecoverypayments', 'PercentFunded', 'Recommendations',
           'InvestmentFromFriendsCount', 'InvestmentFromFriendsAmount', 
           'Investors', 'ScorexChangeAtTimeOfListing', 'LoanStatus', 
           'BorrowerRate', 'LenderYield', 'ProsperScore', 'BorrowerState', 
           'CurrentCreditLines', 'OpenCreditLines', 'OpenRevolvingAccounts', 
           'OpenRevolvingMonthlyPayment', 'CurrentDelinquencies', 'AmountDelinquent',
           'RevolvingCreditBalance', 'TotalProsperPaymentsBilled',
           'LoanCurrentDaysDelinquent', 'ListingCategory (numeric)', 'IncomeRange', 
           'LoanOriginationDate', 'CreditScoreRangeLower', 'CreditScoreRangeUpper']
           
#Add feature for before and after crisis
df['Crisis'] = None
df['Crisis'][df['LoanOriginationDate'] < datetime.date(2009, 1, 1)] = 'Before'
df['Crisis'][df['LoanOriginationDate'] >= datetime.date(2009, 1, 1)] = 'After'

#Remove any records with missing credit score
df = df[pd.isnull(df['CreditScoreRangeLower']) == False]

#Add credit label
df['CreditCategory']= None

def creditCategory(row):
    if row['CreditScoreRangeUpper'] < 620:
        return 'Subprime'
    
    if row['CreditScoreRangeLower'] >=620 and row['CreditScoreRangeUpper'] < 680:
        return 'Acceptable'
        
    if row['CreditScoreRangeLower'] >= 680 and row['CreditScoreRangeUpper'] < 740:
        return 'Good'
        
    if row['CreditScoreRangeLower'] >= 740:
        return 'Excellent'

df['CreditCategory'] = df.apply(creditCategory, axis=1)

#Reverse quarter information for easier sorting.
def reverseQuarter(row):
    return row['LoanOriginationQuarter'][3:] + " "  + \
           row['LoanOriginationQuarter'][:2]
    
df['LoanOriginationQuarter'] = df.apply(reverseQuarter, axis=1)

#Reduce dataset to only applicable features
df = df[[column for column in df.columns if column not in exclude]]

#Save back to csv
df.to_csv('prosperLoanData_reduced.csv', index=False)
