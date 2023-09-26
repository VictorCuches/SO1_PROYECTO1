import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell component="th" scope="row">
          {row.Pid}
        </TableCell>
        <TableCell align="center">{row.Nombre}</TableCell>
        <TableCell align="center">{row.User}</TableCell>
        <TableCell align="center">{row.Estado}</TableCell>
        <TableCell align="center">{row.Ram}</TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Hijos
              </Typography>
              <Table size="small" aria-label="children">
                <TableHead>
                  <TableRow>
                  <TableCell>PID</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>%Ram</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.Hijos.map((hijo) => (
                    <TableRow key={hijo.Pid}>
                      <TableCell component="th" scope="row">
                        {hijo.Pid}
                      </TableCell>
                      <TableCell>{hijo.Nombre}</TableCell>
                      <TableCell>{hijo.User }</TableCell>
                      <TableCell>{hijo.Estado}</TableCell>
                      <TableCell>{hijo.Ram}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    Pid: PropTypes.number.isRequired,
    Nombre: PropTypes.string.isRequired,
    User: PropTypes.number.isRequired,
    Estado: PropTypes.string.isRequired,
    Ram: PropTypes.number.isRequired,
    Hijos: PropTypes.arrayOf(
      PropTypes.shape({
        Pid: PropTypes.number.isRequired,
        Nombre: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default function CollapsibleTable({ data }) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell align="center">PID</TableCell>
            <TableCell align="center">Nombre</TableCell>
            <TableCell align="center">Usuario</TableCell>
            <TableCell align="center">Estado</TableCell>
            <TableCell align="center">%Ram</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((proceso) => (
            <Row key={proceso.Pid} row={proceso} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
