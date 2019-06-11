import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import { shadows } from '@material-ui/system';
import CardMedia from '@material-ui/core/CardMedia';

const useStyles = makeStyles({
  card: {
    width: 300,
    background: 'linear-gradient(45deg, #A2E5D5 100%, #FDFDFD 100%)',
    margin: 15
  },
  media: {
    height: 300,
  },
});

export default function ArtCard(props) {
  const classes = useStyles();

  return (
    <Card boxShadow={2} className={classes.card}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={props.art}
        />
      </CardActionArea>
    </Card>
  );
}