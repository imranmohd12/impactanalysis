import React, { useEffect, useMemo, useState } from "react";
import { useTable } from "react-table";
import './Table.css';


function TableContents() {
  const [data, setData] = useState([]);
  const [updatedData, setUpdatedData] = useState([]);
  const columns = [
    {
      Header: "Id",
      accessor: "id",
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Category",
      accessor: "category",
    },
    {
      Header: "Image",
      accessor: "image",
      Cell: ({ value }) => <img src={value} alt="img-alt" height={'100px'} />,
    },
    {
      Header: "Label",
      accessor: "label",
    },
    {
      Header: "Price",
      accessor: "price",
      Cell: ({ value, row }) => (
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const newData = [...updatedData];
            console.log(row.index);
            console.log("updateddata ",updatedData);
            console.log("newdata ",newData);
            console.log("data ",data);
            newData[row.index].price = e.target.value;
            setUpdatedData(newData);
          }}
        />
      ),
    },
    {
      Header: "Description",
      accessor: "description",
    },
  ];  
  const cols = useMemo(() => columns, []);

  const fetchData = async () => {
    try {
      const res = await fetch("https://s3-ap-southeast-1.amazonaws.com/he-public-data/reciped9d7b8c.json");
      const resData = await res.json();
      setData(resData);
      setUpdatedData(resData);
      console.log("data updated")
      
    } catch (err) {
      console.log("Error in fetching data ", err);
    }
  };

  useEffect(() => {
      fetchData();
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({
    columns: cols,
    data: useMemo(() => updatedData, [updatedData]),
  });

  return (
    <div>
      <table {...getTableProps} id="TestData">
        <thead>
          {headerGroups.map((hg) => (
            <tr {...hg.getHeaderGroupProps()}>
              {hg.headers.map((col) => (
                <th {...col.getHeaderProps}>{col.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <center>
        <button className="save" onClick={() =>{ 
            setData(updatedData);
            console.log("save called");
            }}>
          Save
        </button>
        <button className="reset">Reset</button>
      </center>
    </div>
  );
}

export default TableContents;