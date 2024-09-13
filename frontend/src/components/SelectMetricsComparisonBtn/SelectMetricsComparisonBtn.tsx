import { useState, useEffect } from 'react';
import {
  Modal,
  Fade,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormControlLabel,
  Box,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IndividualMetric } from '../../types/comparison';
import MetricService from '../../services/MetricService';

interface Props {
  onMetricsSelect: (selectedMetrics: IndividualMetric[]) => void;
}

/**
 * Component that provides a modal to select metrics for comparison.
 * Allows users to filter metrics by category and select/deselect them.
 */
const SelectMetricsComparisonBtn: React.FC<Props> = ({ onMetricsSelect }) => {
  const [open, setOpen] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState<IndividualMetric[]>([]);
  const [allMetrics, setAllMetrics] = useState<IndividualMetric[]>([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  /**
   * Handle the change of a metric's checkbox selection.
   * Updates the list of selected metrics based on the checkbox state.
   */
  const handleCheckboxChange = (metric: IndividualMetric) => {
    const currentIndex = selectedMetrics.findIndex((m) => m.metric_id === metric.metric_id);
    const newSelectedMetrics = [...selectedMetrics];

    if (currentIndex === -1) {
      newSelectedMetrics.push(metric);
    } else {
      newSelectedMetrics.splice(currentIndex, 1);
    }

    setSelectedMetrics(newSelectedMetrics);
  };

  const handleApply = () => {
    onMetricsSelect(selectedMetrics);
    handleClose();
  };

  /**
   * Fetch all metrics on component mount.
   */
  useEffect(() => {
    const fetchData = async () => {
      const allMetrics = await MetricService.obtainAllMetrics();
      setAllMetrics(allMetrics);
    };
    fetchData();
  }, []);

  return (
    <>
      <Button
        variant="outlined"
        sx={{
          textTransform: 'none',
          letterSpacing: '0.005rem',
          fontFamily: 'Rajdhani',
          paddingX: '1.25rem',
          paddingY: 0.75,
          fontSize: '16px',
          fontWeight: 600,
          color: '#000000',
          backgroundColor: '#c7cccf',
          borderColor: '#000000',
          borderRadius: 0,
          '&:hover': {
            backgroundColor: '#a6aeb3',
            borderColor: '#000000',
          },
        }}
        onClick={handleOpen}
      >
        Select Metrics
        <svg
          className="ml-3"
          fill="#000000"
          width="20px"
          height="20px"
          viewBox="0 -1.5 27 27"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="m24 24h-24v-24h18.4v2.4h-16v19.2h20v-8.8h2.4v11.2zm-19.52-12.42 1.807-1.807 5.422 5.422 13.68-13.68 1.811 1.803-15.491 15.491z" />
        </svg>
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              width: '60%',
              bgcolor: 'background.paper',
              p: 4,
              borderRadius: 5,
              maxHeight: '85vh',
              overflowY: 'auto',
            }}
          >
            <Typography variant="h5" sx={{ marginBottom: 2, fontFamily: 'Rajdhani', fontWeight: 'bold' }}>
              Filter Metrics
            </Typography>

            {/* Environmental Section */}
            <Accordion sx={{ border: '1px solid black', marginBottom: '8px' }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  '& .MuiTypography-root': {
                    fontWeight: 'bold',
                    color: '#1c611b',
                  },
                }}
              >
                <Typography>Environmental</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(285px, 1fr))' }}>
                  {allMetrics
                    .filter((metric: IndividualMetric) => metric.pillar === 'E')
                    .map((metric: IndividualMetric, index: number) => (
                      <FormControlLabel
                        key={index}
                        control={
                          <Checkbox
                            checked={selectedMetrics.some((m) => m.metric_id === metric.metric_id)}
                            onChange={() => handleCheckboxChange(metric)}
                          />
                        }
                        label={<Typography sx={{ fontSize: '0.89rem' }}>{metric.metric_name}</Typography>}
                        sx={{ flexBasis: '32%' }}
                      />
                    ))}
                </Box>
              </AccordionDetails>
            </Accordion>

            {/* Social Section */}
            <Accordion sx={{ border: '1px solid black', marginBottom: '8px' }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  '& .MuiTypography-root': {
                    fontWeight: 'bold',
                    color: '#437098',
                  },
                }}
              >
                <Typography>Social</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(315px, 1fr))' }}>
                  {allMetrics
                    .filter((metric: IndividualMetric) => metric.pillar === 'S')
                    .map((metric: IndividualMetric, index: number) => (
                      <FormControlLabel
                        key={index}
                        control={
                          <Checkbox
                            checked={selectedMetrics.some((m) => m.metric_id === metric.metric_id)}
                            onChange={() => handleCheckboxChange(metric)}
                          />
                        }
                        label={<Typography sx={{ fontSize: '0.89rem' }}>{metric.metric_name}</Typography>}
                        sx={{ flexBasis: '32%' }}
                      />
                    ))}
                </Box>
              </AccordionDetails>
            </Accordion>

            {/* Governance Section */}
            <Accordion sx={{ border: '1px solid black', marginBottom: '8px' }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  '& .MuiTypography-root': {
                    fontWeight: 'bold',
                    color: '#a94b4b',
                  },
                }}
              >
                <Typography>Governance</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(315px, 1fr))' }}>
                  {allMetrics
                    .filter((metric: IndividualMetric) => metric.pillar === 'G')
                    .map((metric: IndividualMetric, index: number) => (
                      <FormControlLabel
                        key={index}
                        control={
                          <Checkbox
                            checked={selectedMetrics.some((m) => m.metric_id === metric.metric_id)}
                            onChange={() => handleCheckboxChange(metric)}
                          />
                        }
                        label={
                          <Typography sx={{ fontSize: '0.89rem', wordBreak: 'break-word' }}>
                            {metric.metric_name}
                          </Typography>
                        }
                        sx={{ flexBasis: '32%' }}
                      />
                    ))}
                </Box>
              </AccordionDetails>
            </Accordion>

            {/* Cancel or Apply Changes Buttons */}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                sx={{
                  color: 'black',
                  '&:hover': {
                    backgroundColor: '#8cbfcf',
                  },
                  marginRight: 1.25,
                }}
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#9ad2e4',
                  border: '1px solid black',
                  '&:hover': {
                    backgroundColor: '#0c6ba1',
                  },
                  color: 'black',
                }}
                onClick={handleApply}
              >
                Apply
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default SelectMetricsComparisonBtn;
