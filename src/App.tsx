import { useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Container,
  Paper,
  InputAdornment,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import AlignmentVisualizer from './components/AlignmentVisualizer';
import './styles/App.css';

// тип для данных формы
type FormValues = {
  seq1: string;
  seq2: string;
};

export default function App() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      seq1: '',
      seq2: '',
    },
  });

  const [alignment, setAlignment] = useState<FormValues | null>(null);
  const [copyMsg, setCopyMsg] = useState(false);

  // Наблюдаем за значениями полей для отображения счетчика
  const seq1Value = watch('seq1') || '';
  const seq2Value = watch('seq2') || '';

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setAlignment(data);
  };

  const handleCopy = () => {
    setCopyMsg(true);
  };

  const handleClearField = (fieldName: keyof FormValues) => {
    setValue(fieldName, '');
  };

  // Обработчик изменения поля ввода для удаления пробелов
  const handleInputChange = (
    value: string,
    fieldName: keyof FormValues,
    onChange: (...event: any[]) => void
  ) => {
    // Удаляем все пробелы из введенного текста
    const valueWithoutSpaces = value.replace(/\s+/g, '');

    // Если значение изменилось (были пробелы), используем оригинальный onChange
    if (valueWithoutSpaces !== value) {
      onChange(valueWithoutSpaces);
    } else {
      // Иначе просто передаем значение
      onChange(value);
    }
  };

  // Обработчик вставки текста для удаления пробелов
  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement | HTMLDivElement>,
    fieldName: keyof FormValues,
    onChange: (...event: any[]) => void
  ) => {
    // Предотвращаем стандартное поведение вставки
    e.preventDefault();

    // Получаем текст из буфера обмена
    const pastedText = e.clipboardData.getData('text');

    // Удаляем все пробелы из вставляемого текста
    const textWithoutSpaces = pastedText.replace(/\s+/g, '');

    // Получаем текущее значение поля
    const currentValue = watch(fieldName) || '';

    // Получаем позицию курсора
    const input = e.target as HTMLInputElement;
    const startPos = input.selectionStart || 0;
    const endPos = input.selectionEnd || 0;

    // Формируем новое значение с вставленным текстом
    const newValue =
      currentValue.substring(0, startPos) + textWithoutSpaces + currentValue.substring(endPos);

    // Обновляем значение поля через onChange
    onChange(newValue);
  };

  return (
    <Container maxWidth="md">
      <Box className="app-container">
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          className="app-title"
          sx={{
            '@media (max-width: 355px)': {
              fontSize: '1rem !important',
            },
          }}
        >
          Визуализация выравнивания аминокислотных последовательностей
        </Typography>

        <Paper elevation={3} className="form-container">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mb: 2 }}>
              <Box sx={{ flex: '1 1 auto' }}>
                <Controller
                  name="seq1"
                  control={control}
                  rules={{
                    required: 'Это поле обязательно',
                    pattern: {
                      value: /^[ARNDCEQGHILKMFPSTWYV-]+$/i,
                      message:
                        "Только латинские буквы аминокислот (A, R, N, D, C, E, Q, G, H, I, L, K, M, F, P, S, T, W, Y, V) и символ '-'",
                    },
                    minLength: {
                      value: 1,
                      message: 'Введите хотя бы один символ',
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      label="Последовательность 1"
                      fullWidth
                      {...field}
                      onChange={(e) => handleInputChange(e.target.value, 'seq1', field.onChange)}
                      onPaste={(e) => handlePaste(e, 'seq1', field.onChange)}
                      error={!!errors.seq1}
                      helperText={errors.seq1?.message}
                      margin="normal"
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">{field.value.length}</InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<ClearIcon />}
                  onClick={() => handleClearField('seq1')}
                  disabled={seq1Value.length === 0}
                  size="small"
                >
                  Сброс
                </Button>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mb: 2 }}>
              <Box sx={{ flex: '1 1 auto' }}>
                <Controller
                  name="seq2"
                  control={control}
                  rules={{
                    required: 'Это поле обязательно',
                    pattern: {
                      value: /^[ARNDCEQGHILKMFPSTWYV-]+$/i,
                      message:
                        "Только латинские буквы аминокислот (A, R, N, D, C, E, Q, G, H, I, L, K, M, F, P, S, T, W, Y, V) и символ '-'",
                    },
                    validate: (value) =>
                      value.length === watch('seq1')?.length ||
                      'Длины последовательностей должны совпадать',
                  }}
                  render={({ field }) => (
                    <TextField
                      label="Последовательность 2"
                      fullWidth
                      {...field}
                      onChange={(e) => handleInputChange(e.target.value, 'seq2', field.onChange)}
                      onPaste={(e) => handlePaste(e, 'seq2', field.onChange)}
                      error={!!errors.seq2}
                      helperText={errors.seq2?.message}
                      margin="normal"
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">{field.value.length}</InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<ClearIcon />}
                  onClick={() => handleClearField('seq2')}
                  disabled={seq2Value.length === 0}
                  size="small"
                >
                  Сброс
                </Button>
              </Box>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="submit-button"
              size="large"
              disabled={seq1Value.length !== seq2Value.length || seq1Value.length === 0}
              sx={{ mt: 2 }}
            >
              Визуализировать выравнивание
            </Button>
          </form>
        </Paper>

        {alignment && (
          <Paper elevation={3} className="result-container">
            <Typography variant="h6" gutterBottom>
              Результат выравнивания:
            </Typography>
            <AlignmentVisualizer seq1={alignment.seq1} seq2={alignment.seq2} onCopy={handleCopy} />
          </Paper>
        )}

        <Snackbar
          open={copyMsg}
          autoHideDuration={1000}
          onClose={() => setCopyMsg(false)}
          message="Последовательность скопирована!"
        />
      </Box>
    </Container>
  );
}
