import React, { Component } from 'react';
import {Map, Marker, TileLayer, Popup} from "react-leaflet";
import 'leaflet/dist/leaflet.css'
import { Sidebar, Tab } from 'react-leaflet-sidetabs'
import { FaMapMarkedAlt } from "react-icons/fa";
import { FiHome, FiChevronRight, FiSearch, FiSettings } from "react-icons/fi";
import L from 'leaflet';
import IQPTable from "./Components/IQPTable";
import TableData from './Components/IQPTableData'
import projectCenters from "./Components/IQPLocations";
import Grid from "@material-ui/core/Grid";
import TextField from '@material-ui/core/TextField';
import './App.css';
import { Button } from "@material-ui/core";
import { ExportToCsv } from 'export-to-csv';
import Box from "@material-ui/core/Box";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

var popup = L.popup();

let selectedCountry = 'home';
let earliestDate = '1997-12-01';
let earliestDate1;
let earliestDate2;
let latestDate = '2020-09-28';
let latestDate1;
let latestDate2;

let earliestDateNum = 19971201;
let latestDateNum = 20200928;
let CenterInfo = [];
let CenterInfoClone = [];

function FindingProjectCenters() {
  projectCenters.forEach(function (key) {
    TableData.forEach(function (Center) {
      if (key.name === Center.ProjectCenter){
        CenterInfo.push(Center);
      }
    });
  })
  CenterInfoClone = CenterInfo;
}

FindingProjectCenters();


const options = {
  fieldSeparator: ',',
  quoteStrings: '"',
  decimalSeparator: '.',
  showLabels: true,
  showTitle: true,
  title: 'Climate Change',
  useTextFile: false,
  useBom: true,
  useKeysAsHeaders: true,
  // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
};

const csvExporter = new ExportToCsv(options);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
      selected: 'home',
    };
  }

  onClose() {
    this.setState({collapsed: true});
  }
  onOpen(id) {
    this.setState({
      collapsed: false,
      selected: id,
    })
  }

  handleClick = (country) => (e) => {
    selectedCountry = country;
    this.filterfunction();
  }

  handleButtonClick = () => (e) => {
    selectedCountry = "home";
    earliestDate = '1997-12-01';
    earliestDate1 = earliestDate.replace('-', '');
    earliestDate2 = earliestDate1.replace('-', '');
    earliestDateNum = parseInt(earliestDate2);
    latestDate = '2020-09-28';
    latestDate1 = latestDate.replace('-', '');
    latestDate2 = latestDate1.replace('-', '');
    latestDateNum = parseInt(latestDate2);
    CenterInfo = [];
    projectCenters.forEach(function (key) {
      TableData.forEach(function (Center) {
        if (key.name === Center.ProjectCenter){
          CenterInfo.push(Center);
        }
      });
    })
    this.onOpen("settings");
  }

  handleEarliestChange = (e) => {
    earliestDate = e.target.value;
    console.log(earliestDate);
    earliestDate1 = earliestDate.replace('-', '');
    console.log(earliestDate1);
    earliestDate2 = earliestDate1.replace('-', '');
    console.log(earliestDate2);
    earliestDateNum = parseInt(earliestDate2);
    this.filterfunction();
  }

  handleLatestChange = (e) => {
    latestDate = e.target.value;
    latestDate1 = latestDate.replace('-', '');
    latestDate2 = latestDate1.replace('-', '');
    latestDateNum = parseInt(latestDate2);
    this.filterfunction();
  }

  filterfunction = () => {
    CenterInfo = [];
    if (selectedCountry === 'home'){
      CenterInfoClone.forEach(function (Center) {
        let CEdate = Center.DateCreated
        if ((CEdate > earliestDateNum) && (CEdate < latestDateNum))  {
          CenterInfo.push(Center);
        }
      });
    }
    CenterInfoClone.forEach(function (Center) {
      let CEdate = Center.DateCreated
      console.log(selectedCountry);
      if (selectedCountry === Center.ProjectCenter) {
        if ((CEdate > earliestDateNum) && (CEdate < latestDateNum)) {
          CenterInfo.push(Center);
        }
      }
    });
    this.onOpen("settings");
  }

  handleCSVClick = () => (e) => {
    csvExporter.generateCsv(CenterInfo);
  }


  render () {
    return (
        <div>
          <Sidebar
              id="sidebar"
              position="right"
              collapsed={this.state.collapsed}
              closeIcon={<FiChevronRight />}
              selected={this.state.selected}
              onOpen={this.onOpen.bind(this)}
              onClose={this.onClose.bind(this)}
          >
            <Tab id="settings" header="Project Centers" icon={<FaMapMarkedAlt />}>
              <Box mt={2} />
              <div>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <form noValidate>
                      <TextField
                          id="date"
                          label="Earliest project date:"
                          value={earliestDate}
                          onChange={this.handleEarliestChange}
                          type="date"
                          InputLabelProps={{
                            shrink: true,
                          }}
                      />
                    </form>
                  </Grid>
                  <Grid item xs={6}>
                    <form noValidate>
                      <TextField
                          id="date"
                          label="Latest project date:"
                          type="date"
                          ref="Latest"
                          value={latestDate}
                          onChange={this.handleLatestChange}
                          InputLabelProps={{
                            shrink: true,
                          }}
                      />
                    </form>
                  </Grid>
                </Grid>
              </div>
              <Box mt={2} />
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Button style={{
                    backgroundColor: "#0074d9",
                  }}
                          onClick={this.handleButtonClick()}
                          variant="contained" color="primary">
                    Clear
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button style={{
                    backgroundColor: "#0074d9",
                  }}
                          onClick={this.handleCSVClick()}
                          variant="contained" color="primary">
                    Dowload .CSV based on your filters
                  </Button>
                </Grid>
              </Grid>
              <Box mt={2} />
              <IQPTable tabledata={CenterInfo}/>
              <Box mt={2} />
              <Button style={{
                backgroundColor: "#0074d9",
              }}
                      onClick={this.handleButtonClick()}
                      variant="contained" color="primary">
                Clear
              </Button>
            </Tab>
          </Sidebar>
          <Map style={{ height: "100vh", width: "100%" }} className="mapStyle" center={[0, 0]} zoom={3}>
            <TileLayer
                attribution='Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
                url={'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'}
            />
            {projectCenters.map((center, k) => {
              let position = [center["coordinates"][0], center["coordinates"][1]]
              return (
                  <Marker
                      key={k}
                      onMouseOver={(e) => {
                        e.target.openPopup();
                      }}
                      onMouseOut={(e) => {
                        e.target.closePopup();
                      }}
                      onClick={this.handleClick(center.name)}
                      position={position}
                  >
                    <Popup> {center.name} </Popup>
                  </Marker>
              )
            })
            }
          </Map>
        </div>
    )
  }
}

