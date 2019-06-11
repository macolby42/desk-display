import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { shadows } from '@material-ui/system';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  card: {
    width: 300,
    background: 'linear-gradient(35deg, #A2E5D5, #FDFDFD)'
  },
  media: {
    height: 300,
  },
});

export default function SongCard(props) {
  const classes = useStyles();

  return (
    <Card boxShadow={2} className={classes.card}>
        <CardContent>
          <Typography gutterBottom align="left" variant="h5" color="textPrimary" component="h2">
            {props.title}
          </Typography>
          <Typography align="left" variant="body2" color="textSecondary" component="p">
            {props.artist}
          </Typography>
        </CardContent>
    </Card>
  );
}