import React, { useState, useEffect } from 'react'; // Only import React once
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
   Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,TableHead,

} from '@mui/material';

import Select from 'react-select'; // Make sure to install react-select
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,  // Add BarChart and Bar here
} from 'recharts';

import { TreeSelect } from 'antd';
const COLORS = ['#B0C4DE', '#FFEBCD', '#DDA0DD', '#FFB6C1', '#E6E6FA'];
const { SHOW_PARENT } = TreeSelect;



const getColorForYear = (year, years) => {
  const yearIndex = parseInt(year) - Math.min(...years); // Normalize year index based on the minimum year
  return COLORS[yearIndex % COLORS.length]; // Use modulus to cycle through the colors if there are more years than colors
};

const calculateGrowthRate = (currentCA, previousCA) => {
  if (previousCA > 0) {
    return ((currentCA - previousCA) / previousCA) * 100;
  }
  return null;
};

const BarGraph = ({ data, selectedRestaurant, selectedVille }) => {
  const years = [...new Set(data.map((item) => item.Année))];

  return (
    <ResponsiveContainer width="90%" height={300}>
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="Mois" interval={0} fontSize={7} fill="#666" tick={{ dy: 10 }} />
    <YAxis tickFormatter={(value) => parseInt(value, 10).toLocaleString('fr-FR')} fontSize={11} fill="#666" tick={{ dx: 2 }} />
    <Tooltip formatter={(value) => value.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} />
    <Legend />
    {years.map((year) => (
      <Bar key={year} dataKey={year} fill={getColorForYear(year, years)} />
    ))}
  </BarChart>
</ResponsiveContainer>

  );
};

const KpiGraph = ({ data, selectedRestaurant  , selectedVille}) => {
      const months = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
      ];

      const years = [...new Set(data.map(item => item.Année))];

      const datasets = years.map(year => {
        const monthlyData = months.map(month => {
          const monthData = data.filter(item => item.Année === year && item.Mois === month);
          return monthData.length > 0 ? monthData[0].CA : 0; // Ensure you return 0 if no data
        });



         return {
              label: year,
              data: monthlyData,
              borderColor: getColorForYear(year, years), // Pass years here
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: false,
            };
          });




        const processedData = months.map(month => {
          const entry = { Mois: month };

          data.forEach(item => {
            if (item.Mois === month) {
              // Check if either selectedRestaurant or selectedVille is empty
              if ((selectedRestaurant === '' || item.Restaurant === selectedRestaurant) &&
                  (selectedVille === '' || item.Ville === selectedVille)) {
                entry[item.Année] = (entry[item.Année] || 0) + (item.CA || 0);
              }
            } else {
              entry[item.Année] = entry[item.Année] || null;
            }
          });

          return entry;
        });

        const growthRates = processedData.map(entry => {
        const rates = {};
        Object.keys(entry).forEach(year => {
          if (year !== 'Mois') {
            const currentCA = entry[year];
            const previousYear = (parseInt(year) - 1).toString();
            const previousCA = entry[previousYear] || null;


            if (previousCA !== null && previousCA > 0) {
              rates[year] = ((currentCA - previousCA) / previousCA) * 100;
            } else {
              rates[year] = null; // Aucune croissance calculable
            }
          }
        });
        return { Mois: entry.Mois, ...rates };
      });
      const CustomTooltipWithGrowth = ({ active, payload }) => {
      if (active && payload && payload.length) {
        const month = payload[0].payload.Mois;
        const tooltipData = payload.map(entry => {
          const year = entry.name;
          const ca = entry.value;
          const growthRate = growthRates.find(rate => rate.Mois === month)[year];
          return { year, ca, growthRate }; // Build the tooltip data structure here
        });
         tooltipData.sort((a, b) => b.year - a.year);


                return (
            <div style={{ padding: '10px', backgroundColor: '#fff' }}>
              <TableContainer component={Paper} style={{ padding: '0', backgroundColor: '#fff', border: '0px solid #ccc' }}>
                <Table style={{ tableLayout: 'fixed', width: '200px', borderCollapse: 'collapse' }}>
                  <TableBody>
                    {tooltipData.map(({ year, ca, growthRate }) => (
                      <TableRow key={year} style={{ height: '30px' }}>
                        <TableCell align="left" style={{ padding: '2px', fontSize: '12px', width: '25%', border: '0px solid #ccc' }}>
                          <strong>{year}</strong>
                        </TableCell>
                        <TableCell align="right" style={{ padding: '2px', fontSize: '12px', width: '45%', border: '0px solid #ccc' }}>
                          {ca !== null && ca !== 0 ? ca.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ' '}
                        </TableCell>
                        <TableCell align="right" style={{ padding: '2px', fontSize: '12px', width: '5%', border: '0px solid #ccc', color: growthRate !== null ? (growthRate > 0 ? 'green' : 'red') : 'inherit' }}>
                          {growthRate !== null ? (growthRate > 0 ? '⬆' : '⬇') : ''}
                        </TableCell>
                        <TableCell align="right" style={{ padding: '2px', fontSize: '12px', width: '25%', border: '0px solid #ccc', color: growthRate !== null ? (growthRate > 0 ? 'green' : 'red') : 'inherit' }}>
                          {growthRate !== null ? `${growthRate.toFixed(2)}%` : ''}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>



        );
      }
      return null;
    };


  return (
    <ResponsiveContainer width="90%" height={300}>
      <LineChart data={processedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Mois" interval={0} fontSize={7} fill="#666" tick={{ dy: 10 }} />
        <YAxis
          tickFormatter={(value) => parseInt(value, 10).toLocaleString('fr-FR')}
          fontSize={11}
          fill="#666"
          tick={{ dx: 2 }}
        />        <Tooltip content={<CustomTooltipWithGrowth growthRates={growthRates} />} />
        <Legend />
        {datasets.map((dataset) => (
          <Line key={dataset.label} type="monotone" dataKey={dataset.label} stroke={dataset.borderColor} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

const CustomPieTooltip = ({ active, payload, growthRates }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0].payload;
    const growthRate = growthRates[name];

    let tooltipColor = '#fff'; // Default color
    if (growthRate > 0) {
      tooltipColor = '#c8e6c9'; // Light green for positive growth
    } else if (growthRate < 0) {
      tooltipColor = '#ffcdd2'; // Light red for negative growth
    }

    return (
      <Paper style={{ padding: '10px', backgroundColor: tooltipColor, borderRadius: '4px' }}>
        <Typography variant="body2">{`${name}: ${value.toLocaleString('fr-FR')}`}</Typography>
        {growthRate !== null ? (
          <Typography variant="body2">
            {`Taux de croissance: ${growthRate.toFixed(2)}%`}
          </Typography>
        ) : (
          <Typography variant="body2">Taux de croissance: </Typography>
        )}
      </Paper>
    );
  }
  return null;
};

const AnnualPieChart = ({ data }) => {
  const totalCAByYear = data.reduce((acc, item) => {
    acc[item.Année] = (acc[item.Année] || 0) + (item.CA || 0);
    return acc;
  }, {});



  const pieData = Object.keys(totalCAByYear).map((year) => ({
    name: year,
    value: totalCAByYear[year],
  }));

  // Calculate growth rates for pie chart tooltip
  const growthRates = {};
  Object.keys(totalCAByYear).forEach((year) => {
    const currentCA = totalCAByYear[year];
    const previousYear = (parseInt(year) - 1).toString();
    const previousCA = totalCAByYear[previousYear] || null;


    if (previousCA !== null && previousCA > 0) {
      growthRates[year] = ((currentCA - previousCA) / previousCA) * 100;
    } else {
      growthRates[year] = null;
    }
  });

  return (
<div style={{ display: 'flex', alignItems: 'flex-start' }}>
  <ResponsiveContainer width="50%" height={200}>
    <PieChart>
      <Pie
        data={pieData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
      >
        {pieData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={getColorForYear(entry.name, Object.keys(totalCAByYear))} />
        ))}
      </Pie>
      <Tooltip content={<CustomPieTooltip growthRates={growthRates} />} />
    </PieChart>
  </ResponsiveContainer>

  {/* Display color information for each year vertically */}
  <div style={{ marginLeft: '20px', display: 'flex', flexDirection: 'column' }}>
    {pieData.map((entry) => (
      <div key={entry.name} style={{ marginBottom: '5px', display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            width: '20px',
            height: '20px',
            backgroundColor: getColorForYear(entry.name, Object.keys(totalCAByYear)),
            display: 'inline-block',
            marginRight: '5px',
          }}
        />
       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', borderBottom: '1px solid #ccc', padding: '5px 0' }}>
  <span style={{ flex: 1, textAlign: 'left' }}>{entry.name}</span>
<span style={{ flex: 1, textAlign: 'left' }}>&nbsp;&nbsp;</span> {/* 2 espaces */}
  <span style={{ flex: 1, textAlign: 'right' }}>{entry.value.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
</div>

 {/* Display year and corresponding value */}
      </div>
    ))}
  </div>
</div>


  );
};


const Dashboard = ({ restaurant, ville}) => {
  const [filters, setFilters] = useState({
    selectedVille: ville || '',
    selectedRestaurant: restaurant || '',


  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [treeData, setTreeData] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
   const [dataTop10RestaurantsByCA, setDataTop10RestaurantsByCA] = useState([]);
   const [DataNombreDeVilles, setDataNombreDeVilles] = useState([]);
    const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filteredData1, setFilteredData1] = useState([]);
    const [FilteredDatatickMoyen, setFilteredDatatickMoyen] = useState([]);
    const [filtereddataGetTopTransactions, setfiltereddataGetTopTransactions] = useState([]);

    const [dataGetTopGuests, setDataGetTopGuests] = useState([]);
    const [filterdataGetTopGuests, setDatafilterGetTopGuests] = useState([]);
  const [dataGetTopTransactions, setDataGetTopTransactions] = useState([]);
  const [tickMoyen, setTickMoyen] = useState([]);
          const [DataCAFoodipex, setDataCAFoodipex] = useState([]);

        const [DataNombreDeRestaurantss, setDataNombreDeRestaurants] = useState([]);

        const [DataCARestaurants, setDataCARestaurants] = useState([]);

 useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const responses = await Promise.all([
        axios.get('http://127.0.0.1:8000/GetCFAVenderesto/'),
        axios.get('http://127.0.0.1:8000/GetCFAchatFoodipex/'),
        axios.get('http://127.0.0.1:8000/GetTopGuests/', {
          params: {
            restaurant: filters.selectedRestaurant,
            ville: filters.selectedVille,
          },
        }),
        axios.get('http://127.0.0.1:8000/GetTopTransactions/', {
          params: {
            restaurant: filters.selectedRestaurant,
            ville: filters.selectedVille,
          },
        }),
        // Updated call for TickMoyen with targetRestaurants as a parameter
        axios.get('http://127.0.0.1:8000/TickMoyen/', {
          params: {
            restaurant: 'filters.selectedRestaurant',
          },
        }),
        axios.get('http://127.0.0.1:8000/GetTop10RestaurantsByCA/'),
      ]);

      const [response1, response2, response3, response4, response5, response6] = responses;

      const venderesto = Array.isArray(response1.data.venderesto) ? response1.data.venderesto : [];
      const achatFoodipex = Array.isArray(response2.data.achatfoodipex) ? response2.data.achatfoodipex : [];
      const dataGetTopGuests = Array.isArray(response3.data.GetTopGuests) ? response3.data.GetTopGuests : [];
      const dataGetTopTransactions = Array.isArray(response4.data.TopTransactions) ? response4.data.TopTransactions : [];
      const tickMoyen = Array.isArray(response5.data.tickmoyen) ? response5.data.tickmoyen : [];
      const dataGetTop10RestaurantsByCA = Array.isArray(response6.data.Top10RestaurantsByCA) ? response6.data.Top10RestaurantsByCA : [];

      setData(venderesto);
      setData1(achatFoodipex);
      setDataGetTopTransactions(dataGetTopTransactions);
      setTickMoyen(tickMoyen);
      setDataGetTopGuests(dataGetTopGuests);
      setDataTop10RestaurantsByCA(dataGetTop10RestaurantsByCA);

      // Handle tree data formatting
      const groupedByCity = venderesto.reduce((acc, item) => {
        const { Ville, Restaurant } = item;
        if (!acc[Ville]) acc[Ville] = new Set();
        acc[Ville].add(Restaurant);
        return acc;
      }, {});

      const treeFormattedData = Object.entries(groupedByCity).map(([city, restaurants]) => ({
        label: city,
        value: city,
        children: Array.from(restaurants).map(restaurant => ({
          label: restaurant,
          value: restaurant,
        })),
      }));
      setTreeData(treeFormattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [filters.selectedRestaurant, filters.selectedVille]);

  // Handle loading and error states in






  const handleChange = (key) => (selectedOption) => {
    setFilters({ ...filters, [key]: selectedOption ? selectedOption.value : '' });
  };

  const addEmptyOption = (options) => [{ value: '', label: 'Toute...' }, ...options];

  function formatSimpleDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('fr-FR', options);
  }


  const handleFilterChange = (key) => (selectedOption) => {
    setFilters({ ...filters, [key]: selectedOption ? selectedOption.value : '' });
  };


  const [isToggled, setIsToggled] = useState(false);

const onChange = (newValue) => {
    setSelectedValues(newValue);
    console.log('Selected values:', newValue);

    // Initialize arrays for selected cities and restaurants
    const selectedCities = new Set();
    const selectedRestaurants = new Set();

    if (newValue.length === 0) {
        setIsToggled(false); // Set isToggled to true if no selection
        console.log('No cities or restaurants selected.');
        return; // Exit early since no further filtering is needed
    } else {
        setIsToggled(true); // Reset isToggled if there are selections
    }

    newValue.forEach(value => {
        const node = treeData.find(item => item.value === value);
        console.log('node:', node);

        if (node) {
            // If it's a parent node, add it to selectedCities
            selectedCities.add(node.value);

            // If the node has children, add each child to selectedRestaurants
            if (node.children) {
                node.children.forEach(child => {
                    selectedRestaurants.add(child.value);
                });
            }
        } else {
            // Handle the case where the value is a child without a parent
            const isChildRestaurant = treeData.some(item =>
                item.children && item.children.some(child => child.value === value)
            );

            if (isChildRestaurant) {
                selectedRestaurants.add(value);
            } else {
                console.log(`Node with value ${value} not found.`);
            }
        }
    });

    const selectedCitiesArray = Array.from(selectedCities);
    const selectedRestaurantsArray = Array.from(selectedRestaurants);

    console.log('Selected Cities:', selectedCitiesArray);
    console.log('Selected Restaurants:', selectedRestaurantsArray);

    // Filter data based on both selected cities and restaurants
    const newFilteredData = data.filter(item => {
        const isCitySelected = selectedCitiesArray.includes(item.Ville);
        const isRestaurantSelected = selectedRestaurantsArray.includes(item.Restaurant);
        return isCitySelected || isRestaurantSelected;
    });

    const newFilteredDatatickMoyen = tickMoyen.filter(item => {
        const isRestaurantSelected = selectedRestaurantsArray.includes(item.CodeRestaurant);
        console.log('kkkkkkkkkkkkkkkkkkk',newFilteredDatatickMoyen)
        return  isRestaurantSelected;
    });

console.log('kkkkkkkkkkkkkkkkkkk',newFilteredDatatickMoyen)

    const newFilteredData1 = data1.filter(item => {
        const isCitySelected = selectedCitiesArray.includes(item.Ville);
        const isRestaurantSelected = selectedRestaurantsArray.includes(item.Restaurant);
        return isCitySelected || isRestaurantSelected;
    });

    const newFiltereddataGetTopTransactions = dataGetTopTransactions.filter(item => {
        const isCitySelected = selectedCitiesArray.includes(item.Ville);
        const isRestaurantSelected = selectedRestaurantsArray.includes(item.Restaurant);
        return isCitySelected || isRestaurantSelected;
    });

    const newFiltereddataGetTopGuests = dataGetTopGuests.filter(item => {
        const isCitySelected = selectedCitiesArray.includes(item.Ville);
        const isRestaurantSelected = selectedRestaurantsArray.includes(item.Restaurant);
        return isCitySelected || isRestaurantSelected;
    });

    // Set the state with filtered data
    setFilteredData(newFilteredData);
    setFilteredData1(newFilteredData1);
    setFilteredDatatickMoyen(newFilteredDatatickMoyen);
    console.log('newFilteredDatatickMoyen',newFilteredDatatickMoyen)
    setfiltereddataGetTopTransactions(newFiltereddataGetTopTransactions);
    setDataGetTopGuests(newFiltereddataGetTopGuests);

    console.log('Filtered Data:', newFilteredData);
    console.log('Filtered DatatickMoyen:', newFilteredDatatickMoyen);
};

// Conditionally set filteredDataTo
console.log('jjjjjjjjjjjj',isToggled)
console.log('FilteredDatatickMoyen',FilteredDatatickMoyen)
const filteredDataTo = !isToggled ? data : filteredData;
const filteredDataTo2 = isToggled ? filteredData1 : data1;
const FilteredDatatickMoyento = FilteredDatatickMoyen;
const filterdataGetTopGueststo = isToggled ? filterdataGetTopGuests : dataGetTopGuests;
const filtereddataGetTopTransactionsto = isToggled ? filtereddataGetTopTransactions : dataGetTopTransactions;




   const tProps = {
    treeData,
    value: selectedValues,
    onChange,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: 'Please select',
    style: {
      width: '100%',
      marginBottom: 16,
    },
  };

  console.log('DataNombreDeVilles',DataNombreDeVilles)

  return (
<div className="dashboard-container" style={{ backgroundColor: '#f3f4f6' , width:'99%' }}>
  <Grid container spacing={2} style={{ minHeight: '100vh', padding: '16px' }}>
    <Grid item xs={12} md={12} justifyContent="center" alignItems="center">
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', padding: '4px', borderBottom: '1px solid #e0e0e0', gap: '10px' }}>
        <TreeSelect {...tProps} />
      </Box>
    </Grid>
    <Grid item xs={12} md={8}>

          <Grid container spacing={2} style={{justifyContent: 'center'}}>
            {/* Top Guests */}
            {tickMoyen.map((item, index) => (
              <Grid item xs={12} sm={6} md={2.6} key={item.CodeRestaurant || index}>
                      <Card variant="outlined" style={{ height: '150px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                        <CardContent style={{ padding: '12px' }}>
                          <Typography variant="subtitle2" color="textSecondary" style={{ display: 'flex', justifyContent: 'center' }}>
                            Ticket moyen1
                          </Typography>
                          <Typography variant="h6" component="p" style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
                            {item.TicketMoyen}
                          </Typography>
                          <Typography variant="body2" component="p" style={{ display: 'flex', justifyContent: 'center', color: '#757575' }}>
                            {filters.selectedRestaurant === '' ? item.Restaurant : ''}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
            ))}

            {DataNombreDeRestaurantss.map((item, index) => (
              <Grid item xs={12} sm={6} md={2.6} key={item.CodeRestaurant || index}>
                      <Card variant="outlined" style={{ height: '150px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                        <CardContent style={{ padding: '12px' }}>
                          <Typography variant="subtitle2" color="textSecondary" style={{ display: 'flex', justifyContent: 'center' }}>
                            Nombre de Restaurant
                          </Typography>
                          <Typography variant="h6" component="p" style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
                            {item.nombre_restaurants}
                          </Typography>

                        </CardContent>
                      </Card>
                    </Grid>
            ))}


            {filtereddataGetTopTransactionsto.map((item, index) => (
              <Grid item xs={12} sm={6} md={2.6} key={item.CodeRestaurant || index}>
                      <Card variant="outlined" style={{ height: '150px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                        <CardContent style={{ padding: '12px' }}>
                          <Typography variant="subtitle2" color="textSecondary" style={{ display: 'flex', justifyContent: 'center' }}>
                            Nombre de couverts
                          </Typography>
                          <Typography variant="h6" component="p" style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
                            {formatSimpleDate(item.Date)}
                          </Typography>
                          <Typography variant="h6" component="p" style={{ display: 'flex', justifyContent: 'center', fontWeight: 'bold' }}>
                            {item.NombreCouverts}
                          </Typography>
                          <Typography variant="body2" component="p" style={{ display: 'flex', justifyContent: 'center', color: '#757575' }}>
                            {filters.selectedRestaurant === '' ? item.Restaurant : ''}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
            ))}
{/* {DataNombreDeVilles.map((item, index) => ( */}
{/*                <Grid item xs={12} sm={6} md={2.8} key={item.CodeRestaurant || index}> */}
{/*                       <Card variant="outlined" style={{ height: '150px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}> */}
{/*                         <CardContent style={{ padding: '12px' }}> */}
{/*                           <Typography variant="subtitle2" color="textSecondary" style={{ display: 'flex', justifyContent: 'center' }}> */}
{/*                             nombre ville */}
{/*                           </Typography> */}

{/*                           <Typography variant="h6" component="p" style={{ display: 'flex', justifyContent: 'center', fontWeight: 'bold' }}> */}
{/*                             {item.nombre_villes} */}
{/*                           </Typography> */}

{/*                         </CardContent> */}
{/*                       </Card> */}
{/*                     </Grid> */}
{/*             ))} */}
            {/* Top Transactions */}
            {filterdataGetTopGueststo.map((item, index) => (
               <Grid item xs={12} sm={6} md={2.8} key={item.CodeRestaurant || index}>
                      <Card variant="outlined" style={{ height: '150px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                        <CardContent style={{ padding: '12px' }}>
                          <Typography variant="subtitle2" color="textSecondary" style={{ display: 'flex', justifyContent: 'center' }}>
                            Le meilleur jour d'affluence
                          </Typography>
                          <Typography variant="h6" component="p" style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
                            {formatSimpleDate(item.DateTransaction)}
                          </Typography>
                          <Typography variant="h6" component="p" style={{ display: 'flex', justifyContent: 'center', fontWeight: 'bold' }}>
                            {item.Couverts}
                          </Typography>
                          <Typography variant="body2" component="p" style={{ display: 'flex', justifyContent: 'center', color: '#757575' }}>
                            {filters.selectedRestaurant === '' ? item.Restaurant : ''}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
            ))}
          </Grid>

    </Grid>

    {/* Annual Revenue Evolution */}
    <Grid container spacing={3} sx={{ padding: '20px' }}>
      <Grid item xs={12} md={8}  >
        <Card >
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'left', width: '100%', paddingBottom: '15px' }}>


               <Typography variant="h6" color="textPrimary" sx={{ fontWeight: 'bold' }}>
Évolution du chiffre d'affaire Foodipex annuelle        </Typography>
            </Box>

            <Grid container spacing={1}>
              <Grid item xs={12} md={6}>
                <KpiGraph data={filteredDataTo} selectedRestaurant={filters.selectedRestaurant} selectedVille={filters.selectedVille} />
              </Grid>
              <Grid item xs={12} md={6}>
                <AnnualPieChart data={filteredDataTo} />
              </Grid>
            </Grid>
          </CardContent> {/* Closing the CardContent */}
        </Card>
      </Grid>

      {/* Top 10 Restaurants Table */}
    <Grid item xs={12} md={4} sx={{ height: 'auto' }}>
  <Card elevation={3} sx={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
    <CardContent sx={{ padding: '16px' }}>
      {/* Title Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <Typography variant="h6" color="textPrimary" sx={{ fontWeight: 'bold' }}>
          Top 5 Clients
        </Typography>
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper} sx={{ height: 'auto', maxHeight: 300 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ padding: '8px', fontWeight: 'bold' }}>Année</TableCell>
              <TableCell sx={{ padding: '8px', fontWeight: 'bold' }}>Mois</TableCell>
              <TableCell sx={{ padding: '8px', fontWeight: 'bold' }}>Ville</TableCell>
              <TableCell sx={{ padding: '8px', fontWeight: 'bold' }}>Restaurant</TableCell>
              <TableCell sx={{ padding: '8px', fontWeight: 'bold' }}>CA</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>


            {dataTop10RestaurantsByCA.map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:hover': {
                    backgroundColor: '#f5f5f5', // Add hover effect
                  },
                  transition: 'background-color 0.3s ease',
                }}
              >
                <TableCell sx={{ padding: '8px' }}>{row.Année}</TableCell>
                <TableCell sx={{ padding: '8px' }}>{row.Mois}</TableCell>
                <TableCell sx={{ padding: '8px' }}>{row.Ville}</TableCell>
                <TableCell sx={{ padding: '8px' }}>{row.Restaurant}</TableCell>
                <TableCell sx={{ padding: '8px' }}>
                  {row.CA.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </CardContent>
  </Card>
</Grid>


    </Grid>

    {/* Sales Revenue Evolution */}
    <Grid item xs={12} md={8} style={{ paddingTop: '20px' , width:'97%' }}>
      <Card  style={{ width:'98%'}}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'left', width: '100%', padding: '3px' }}>


            <Typography variant="h6" color="textPrimary" sx={{ fontWeight: 'bold' }}>
              Évolution du chiffre d'affaire Vente Restaurants
       </Typography>

          </Box>

          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              <KpiGraph data={filteredDataTo2} selectedRestaurant={filters.selectedRestaurant} selectedVille={filters.selectedVille} />
            </Grid>
            <Grid item xs={12} md={6}>
              <AnnualPieChart data={filteredDataTo2} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

    </Grid>
        <Grid item xs={12} md={4} sx={{ height: 'auto' }}>
                          <BarGraph data={filteredDataTo2}  />

</Grid>
  </Grid>
</div>

  );
};

export default Dashboard;