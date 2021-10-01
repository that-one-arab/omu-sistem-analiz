import React from "react";
import XLSX from "xlsx"
import "./sheetjs.css"

/* xlsx.js (C) 2013-present  SheetJS -- http://sheetjs.com */
/* Notes:
   - usage: `ReactDOM.render( <SheetJSApp />, document.getElementById('app') );`
   - xlsx.full.min.js is loaded in the head of the HTML page
   - this script should be referenced with type="text/babel"
   - babel.js in-browser transpiler should be loaded before this script
*/
class SheetJSApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [], /* Array of Arrays e.g. [["a","b"],[1,2]] */
			cols: [{key: 1, name: "ID"}, {key: 2, name: "Name"}, {key: 3, name: "Name"}, {key: 4, name: "Name"}]  /* Array of column objects e.g. { name: "C", K: 2 } */
		};
		this.handleFile = this.handleFile.bind(this);
		this.exportFile = this.exportFile.bind(this);
	};

	handleFile(file /*:File*/) {
		/* Boilerplate to set up FileReader */
		const reader = new FileReader();
		const rABS = !!reader.readAsBinaryString;
        console.log("rABS is: ", rABS);
		reader.onload = (e) => {
			/* Parse data */
			const bstr = e.target.result;
            console.log("bstr is: ", bstr);

			const wb = XLSX.read(bstr, {
                type:rABS ? 'binary' : 'array', 
            });
            
            console.log("wb is: ", wb);

			/* Get first worksheet */
			const wsname = wb.SheetNames[0];
            console.log("wsname is: ", wsname);

			const ws = wb.Sheets[wsname];
            console.log("ws is: ", ws);


			/* Convert array of arrays */
			const data = XLSX.utils.sheet_to_json(ws, {header:1, raw: false});
            console.log("data is: ", data);

			/* Update state */
			// this.setState({ data: data, cols: make_cols(ws['!ref']) });
            this.setState({ data: data, cols: make_cols(ws['!ref']) });

		};
		if(rABS) reader.readAsBinaryString(file); 
        else reader.readAsArrayBuffer(file);
	};
    
	exportFile() {
		/* convert state to workbook */
		const ws = XLSX.utils.aoa_to_sheet(this.state.data);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
		/* generate XLSX file and send to client */
		XLSX.writeFile(wb, "sheetjs.xlsx")
	};

	render() { 
        return (
            <DragDropFile handleFile={this.handleFile} className = "sheet" >
                <div className="row">
                    <div className="col-xs-12">
                        <DataInput handleFile={this.handleFile} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <button disabled={!this.state.data.length} className="btn btn-success" onClick={this.exportFile}>Export</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <OutTable data={this.state.data} cols={this.state.cols} />
                    </div>
                </div>
            </DragDropFile>
        ); 
    };
};

/* -------------------------------------------------------------------------- */

/*
  Simple HTML5 file drag-and-drop wrapper
  usage: <DragDropFile handleFile={handleFile}>...</DragDropFile>
    handleFile(file:File):void;
*/
export class DragDropFile extends React.Component {
	constructor(props) {
		super(props);
		this.onDrop = this.onDrop.bind(this);
	};
	suppress(evt) {
         evt.stopPropagation(); evt.preventDefault(); 
    };
	onDrop(evt) {
         evt.stopPropagation(); evt.preventDefault();
		const files = evt.dataTransfer.files;
		if(files && files[0]) this.props.handleFile(files[0]);
	};
	render() {
        return (
            <div onDrop={this.onDrop} onDragEnter={this.suppress} onDragOver={this.suppress}>
                {this.props.children}
            </div>
        ); 
    };
};

/*
  Simple HTML5 file input wrapper
  usage: <DataInput handleFile={callback} />
    handleFile(file:File):void;
*/
export class DataInput extends React.Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
	};
	handleChange(e) {
		const files = e.target.files;
		if(files && files[0]) this.props.handleFile(files[0]);
	};
	render() {
        return (
            <form className="form-inline">
                <div className="form-group">
                    <label htmlFor="file">Spreadsheet</label>
                    <input type="file" placeholder = "asd" className="form-control" id="file" accept={SheetJSFT} onChange={this.handleChange} />
                </div>
            </form>
        ); 
    };
}

/*
  Simple HTML Table
  usage: <OutTable data={data} cols={cols} />
    data:Array<Array<any> >;
    cols:Array<{name:string, key:number|string}>;
*/
export class OutTable extends React.Component {
	render() {
        console.log("the.props.cols is :", this.props.cols)
        // array of objects with KEY and NAME values: [{key: 1, name: "milo"}, {key: 2, name: "sally"}]
        console.log("the.props.data is :", this.props.data)
        return (
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>{this.props.cols.map((c) => <th key={c.key}>{c.name}</th> )}</tr>
                    </thead>
                    <tbody>
                        {
                            this.props.data.map((r,i) => 
                                <tr key={i}>
                                {
                                    this.props.cols.map(c => 
                                        <td key={c.key}>{ r[c.key] } </td> 
                                        )
                                }
                                </tr>
                                )
                        }
                    </tbody>
                </table>
            </div>
        ); 
    };
};

/* list of supported file types */
export const SheetJSFT = [
	"xlsx", "xlsb", "xlsm", "xls", "xml", "csv", "txt", "ods", "fods", "uos", "sylk", "dif", "dbf", "prn", "qpw", "123", "wb*", "wq*", "html", "htm"
].map(function(x) { return "." + x; }).join(",");

/* generate an array of column objects */
export const make_cols = refstr => {
    // C is the number of cols in datasheet
	let o = [], C = XLSX.utils.decode_range(refstr).e.c + 1;
    console.log(C);
	for(var i = 0; i < C; ++i) {
        //XLSX.utils.encode_col is the letter value of a col
        console.log(XLSX.utils.encode_col(i));
        o[i] = {name:XLSX.utils.encode_col(i), key:i}
    }
	return o;
};

export default SheetJSApp