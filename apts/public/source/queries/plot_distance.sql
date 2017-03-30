------ old db ------
with base as ( 
select 
substring(lon::text from 1 for 6) as lon
, substring(lat::text from 1 for 6) as lat
, avg_time_to_central::numeric as avg_time_to_central
, address
, sold_price
, sqm 
from apartments 
) 
select 
lon
,lat
, round(avg(avg_time_to_central),1) as avg_time
, min(address) as address
, round(avg(sold_price::numeric/sqm::numeric)/1000)*1000 as price 
from base group by 1,2

------ new db ------
with base as ( 
select substring(a.lon::text from 1 for 6) as lon
, substring(a.lat::text from 1 for 6) as lat
, g.avg_time_to_central::numeric as avg_time_to_central
, address
, sold_price
, sqm 
from apartments a 
left join geo_data_sl g on (g.lon = round(a.lon::numeric,3)::text and g.lat = round(a.lat::numeric,3)::text) 
) 
select 
lon
,lat
, round(avg(avg_time_to_central),1) as avg_time
, min(address) as address
, round(avg(sold_price::numeric/sqm::numeric)/1000)*1000 as price 
from base group by 1,2
having round(avg(avg_time_to_central),1) > 0

with base as ( select substring(a.lon::text from 1 for 6) as lon , substring(a.lat::text from 1 for 6) as lat , g.avg_time_to_central::numeric as avg_time_to_central , address , sold_price , sqm from apartments a left join geo_data_sl g on (g.lon = round(a.lon::numeric,3)::text and g.lat = round(a.lat::numeric,3)::text) ) select lon ,lat , round(avg(avg_time_to_central),1) as avg_time , min(address) as address , round(avg(sold_price::numeric/sqm::numeric)/1000)*1000 as price from base group by 1,2 having round(avg(avg_time_to_central),1) > 0 