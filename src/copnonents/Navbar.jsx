import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
        <li><Link to="/clients">Clients</Link></li>
        <li><Link to="/debts">Debts</Link></li>
        <li><Link to="/policies">Policies</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;

