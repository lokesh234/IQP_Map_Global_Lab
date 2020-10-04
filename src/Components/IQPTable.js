import React, {Component} from "react";
import TableData from "./IQPTableData";
import MaterialTable from "material-table";
import Box from "@material-ui/core/Box";
import './styles.css'

const colnames = [
    {
        title: 'Title', field: 'Title'
    },
    {
        title: 'Sponsor', field: 'Sponsor'
    },
    {
        title: 'Subject Terms', field: 'SubjectTerms'
    },
    {
        title: 'General Terms', field: 'GeneralTerms'
    },
    {
        title: 'Location', field: 'Location'
    },
    {
        title: 'Link', field: 'Link',
        render: rowData => <a href={rowData.Link} target="_blank">{rowData.Link}</a>,
    }
]

const IQPTable =  ({ tabledata }) => {
    return(
        <div>
            <Box mt={2} />
            <MaterialTable title="IQPs"
                           columns={colnames.map((c) => ({ ...c, tableData: undefined }))}
                           data={tabledata}
                           options={{
                               search: true,
                               pageSize:200,
                               pageSizeOptions: [10]
                           }}/>
        </div>
    )
}

export default IQPTable;
