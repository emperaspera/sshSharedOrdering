PGDMP  $    $                |            ssh    16.2    16.2 L    K           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            L           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            M           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            N           1262    17651    ssh    DATABASE        CREATE DATABASE ssh WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United Kingdom.1252';
    DROP DATABASE ssh;
                postgres    false            �            1259    17689 
   categories    TABLE     �   CREATE TABLE public.categories (
    category_id integer NOT NULL,
    supermarket_id integer,
    name character varying(100) NOT NULL
);
    DROP TABLE public.categories;
       public         heap    postgres    false            �            1259    17688    categories_category_id_seq    SEQUENCE     �   CREATE SEQUENCE public.categories_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.categories_category_id_seq;
       public          postgres    false    222            O           0    0    categories_category_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.categories_category_id_seq OWNED BY public.categories.category_id;
          public          postgres    false    221            �            1259    17653 
   households    TABLE     �   CREATE TABLE public.households (
    household_id integer NOT NULL,
    address text NOT NULL,
    pin_password text NOT NULL
);
    DROP TABLE public.households;
       public         heap    postgres    false            �            1259    17652    households_household_id_seq    SEQUENCE     �   CREATE SEQUENCE public.households_household_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.households_household_id_seq;
       public          postgres    false    216            P           0    0    households_household_id_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.households_household_id_seq OWNED BY public.households.household_id;
          public          postgres    false    215            �            1259    17733    order_items    TABLE     �  CREATE TABLE public.order_items (
    item_id integer NOT NULL,
    order_id integer,
    product_id integer,
    user_id integer,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    delivery_fee_share numeric(10,2),
    service_fee_share numeric(10,2),
    user_total numeric(10,2),
    tax_share numeric(10,2) DEFAULT 0
);
    DROP TABLE public.order_items;
       public         heap    postgres    false            �            1259    17732    order_items_item_id_seq    SEQUENCE     �   CREATE SEQUENCE public.order_items_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.order_items_item_id_seq;
       public          postgres    false    228            Q           0    0    order_items_item_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.order_items_item_id_seq OWNED BY public.order_items.item_id;
          public          postgres    false    227            �            1259    17713    orders    TABLE     �  CREATE TABLE public.orders (
    order_id integer NOT NULL,
    user_id integer,
    household_id integer,
    is_shared boolean DEFAULT false,
    total_cost numeric(10,2),
    delivery_fee numeric(10,2),
    service_fee numeric(10,2),
    status character varying(20) DEFAULT 'Pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    delivery_date date NOT NULL,
    tax numeric(10,2) DEFAULT 0
);
    DROP TABLE public.orders;
       public         heap    postgres    false            �            1259    17712    orders_order_id_seq    SEQUENCE     �   CREATE SEQUENCE public.orders_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.orders_order_id_seq;
       public          postgres    false    226            R           0    0    orders_order_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.orders_order_id_seq OWNED BY public.orders.order_id;
          public          postgres    false    225            �            1259    17755    payments    TABLE     2  CREATE TABLE public.payments (
    payment_id integer NOT NULL,
    order_id integer,
    user_id integer,
    amount numeric(10,2) NOT NULL,
    status character varying(20) DEFAULT 'Pending'::character varying,
    transaction_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_amount_nonzero CHECK ((amount <> (0)::numeric)),
    CONSTRAINT chk_status_valid CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'completed'::character varying, 'failed'::character varying, 'SUCCESS'::character varying])::text[])))
);
    DROP TABLE public.payments;
       public         heap    postgres    false            �            1259    17754    payments_payment_id_seq    SEQUENCE     �   CREATE SEQUENCE public.payments_payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.payments_payment_id_seq;
       public          postgres    false    230            S           0    0    payments_payment_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.payments_payment_id_seq OWNED BY public.payments.payment_id;
          public          postgres    false    229            �            1259    17703    products    TABLE     >  CREATE TABLE public.products (
    product_id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    category character varying(50),
    image_url text,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    supermarket_id integer
);
    DROP TABLE public.products;
       public         heap    postgres    false            �            1259    17702    products_product_id_seq    SEQUENCE     �   CREATE SEQUENCE public.products_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.products_product_id_seq;
       public          postgres    false    224            T           0    0    products_product_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.products_product_id_seq OWNED BY public.products.product_id;
          public          postgres    false    223            �            1259    17680    supermarkets    TABLE     �   CREATE TABLE public.supermarkets (
    supermarket_id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    rating numeric(3,2),
    image_url text
);
     DROP TABLE public.supermarkets;
       public         heap    postgres    false            �            1259    17679    supermarkets_supermarket_id_seq    SEQUENCE     �   CREATE SEQUENCE public.supermarkets_supermarket_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 6   DROP SEQUENCE public.supermarkets_supermarket_id_seq;
       public          postgres    false    220            U           0    0    supermarkets_supermarket_id_seq    SEQUENCE OWNED BY     c   ALTER SEQUENCE public.supermarkets_supermarket_id_seq OWNED BY public.supermarkets.supermarket_id;
          public          postgres    false    219            �            1259    17662    users    TABLE     �  CREATE TABLE public.users (
    user_id integer NOT NULL,
    household_id integer,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    pin_password text,
    phone_number character varying(15),
    address text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_blocked boolean DEFAULT false,
    balance numeric DEFAULT 0 NOT NULL
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    17661    users_user_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.users_user_id_seq;
       public          postgres    false    218            V           0    0    users_user_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;
          public          postgres    false    217            y           2604    17692    categories category_id    DEFAULT     �   ALTER TABLE ONLY public.categories ALTER COLUMN category_id SET DEFAULT nextval('public.categories_category_id_seq'::regclass);
 E   ALTER TABLE public.categories ALTER COLUMN category_id DROP DEFAULT;
       public          postgres    false    222    221    222            s           2604    17656    households household_id    DEFAULT     �   ALTER TABLE ONLY public.households ALTER COLUMN household_id SET DEFAULT nextval('public.households_household_id_seq'::regclass);
 F   ALTER TABLE public.households ALTER COLUMN household_id DROP DEFAULT;
       public          postgres    false    215    216    216            �           2604    17736    order_items item_id    DEFAULT     z   ALTER TABLE ONLY public.order_items ALTER COLUMN item_id SET DEFAULT nextval('public.order_items_item_id_seq'::regclass);
 B   ALTER TABLE public.order_items ALTER COLUMN item_id DROP DEFAULT;
       public          postgres    false    227    228    228            |           2604    17716    orders order_id    DEFAULT     r   ALTER TABLE ONLY public.orders ALTER COLUMN order_id SET DEFAULT nextval('public.orders_order_id_seq'::regclass);
 >   ALTER TABLE public.orders ALTER COLUMN order_id DROP DEFAULT;
       public          postgres    false    225    226    226            �           2604    17758    payments payment_id    DEFAULT     z   ALTER TABLE ONLY public.payments ALTER COLUMN payment_id SET DEFAULT nextval('public.payments_payment_id_seq'::regclass);
 B   ALTER TABLE public.payments ALTER COLUMN payment_id DROP DEFAULT;
       public          postgres    false    230    229    230            z           2604    17706    products product_id    DEFAULT     z   ALTER TABLE ONLY public.products ALTER COLUMN product_id SET DEFAULT nextval('public.products_product_id_seq'::regclass);
 B   ALTER TABLE public.products ALTER COLUMN product_id DROP DEFAULT;
       public          postgres    false    224    223    224            x           2604    17683    supermarkets supermarket_id    DEFAULT     �   ALTER TABLE ONLY public.supermarkets ALTER COLUMN supermarket_id SET DEFAULT nextval('public.supermarkets_supermarket_id_seq'::regclass);
 J   ALTER TABLE public.supermarkets ALTER COLUMN supermarket_id DROP DEFAULT;
       public          postgres    false    220    219    220            t           2604    17665    users user_id    DEFAULT     n   ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);
 <   ALTER TABLE public.users ALTER COLUMN user_id DROP DEFAULT;
       public          postgres    false    218    217    218            @          0    17689 
   categories 
   TABLE DATA           G   COPY public.categories (category_id, supermarket_id, name) FROM stdin;
    public          postgres    false    222   u`       :          0    17653 
   households 
   TABLE DATA           I   COPY public.households (household_id, address, pin_password) FROM stdin;
    public          postgres    false    216   4a       F          0    17733    order_items 
   TABLE DATA           �   COPY public.order_items (item_id, order_id, product_id, user_id, quantity, unit_price, subtotal, delivery_fee_share, service_fee_share, user_total, tax_share) FROM stdin;
    public          postgres    false    228   b       D          0    17713    orders 
   TABLE DATA           �   COPY public.orders (order_id, user_id, household_id, is_shared, total_cost, delivery_fee, service_fee, status, created_at, delivery_date, tax) FROM stdin;
    public          postgres    false    226   �b       H          0    17755    payments 
   TABLE DATA           c   COPY public.payments (payment_id, order_id, user_id, amount, status, transaction_date) FROM stdin;
    public          postgres    false    230   d       B          0    17703    products 
   TABLE DATA           y   COPY public.products (product_id, name, description, price, category, image_url, updated_at, supermarket_id) FROM stdin;
    public          postgres    false    224   �e       >          0    17680    supermarkets 
   TABLE DATA           \   COPY public.supermarkets (supermarket_id, name, description, rating, image_url) FROM stdin;
    public          postgres    false    220   �w       <          0    17662    users 
   TABLE DATA           �   COPY public.users (user_id, household_id, first_name, last_name, email, password_hash, pin_password, phone_number, address, created_at, is_blocked, balance) FROM stdin;
    public          postgres    false    218   �x       W           0    0    categories_category_id_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.categories_category_id_seq', 1470, true);
          public          postgres    false    221            X           0    0    households_household_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.households_household_id_seq', 3, true);
          public          postgres    false    215            Y           0    0    order_items_item_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.order_items_item_id_seq', 41, true);
          public          postgres    false    227            Z           0    0    orders_order_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.orders_order_id_seq', 38, true);
          public          postgres    false    225            [           0    0    payments_payment_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.payments_payment_id_seq', 86, true);
          public          postgres    false    229            \           0    0    products_product_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.products_product_id_seq', 1, false);
          public          postgres    false    223            ]           0    0    supermarkets_supermarket_id_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public.supermarkets_supermarket_id_seq', 1, false);
          public          postgres    false    219            ^           0    0    users_user_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.users_user_id_seq', 3, true);
          public          postgres    false    217            �           2606    17694    categories categories_pkey 
   CONSTRAINT     a   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);
 D   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_pkey;
       public            postgres    false    222            �           2606    17696 -   categories categories_supermarket_id_name_key 
   CONSTRAINT     x   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_supermarket_id_name_key UNIQUE (supermarket_id, name);
 W   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_supermarket_id_name_key;
       public            postgres    false    222    222            �           2606    17660    households households_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.households
    ADD CONSTRAINT households_pkey PRIMARY KEY (household_id);
 D   ALTER TABLE ONLY public.households DROP CONSTRAINT households_pkey;
       public            postgres    false    216            �           2606    17738    order_items order_items_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (item_id);
 F   ALTER TABLE ONLY public.order_items DROP CONSTRAINT order_items_pkey;
       public            postgres    false    228            �           2606    17721    orders orders_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);
 <   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_pkey;
       public            postgres    false    226            �           2606    17762    payments payments_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (payment_id);
 @   ALTER TABLE ONLY public.payments DROP CONSTRAINT payments_pkey;
       public            postgres    false    230            �           2606    17711    products products_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);
 @   ALTER TABLE ONLY public.products DROP CONSTRAINT products_pkey;
       public            postgres    false    224            �           2606    17687    supermarkets supermarkets_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.supermarkets
    ADD CONSTRAINT supermarkets_pkey PRIMARY KEY (supermarket_id);
 H   ALTER TABLE ONLY public.supermarkets DROP CONSTRAINT supermarkets_pkey;
       public            postgres    false    220            �           2606    17673    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public            postgres    false    218            �           2606    17671    users users_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    218            �           1259    17788    idx_order_id    INDEX     E   CREATE INDEX idx_order_id ON public.payments USING btree (order_id);
     DROP INDEX public.idx_order_id;
       public            postgres    false    230            �           1259    17789    idx_transaction_date    INDEX     U   CREATE INDEX idx_transaction_date ON public.payments USING btree (transaction_date);
 (   DROP INDEX public.idx_transaction_date;
       public            postgres    false    230            �           1259    17787    idx_user_id    INDEX     C   CREATE INDEX idx_user_id ON public.payments USING btree (user_id);
    DROP INDEX public.idx_user_id;
       public            postgres    false    230            �           2606    17697 )   categories categories_supermarket_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_supermarket_id_fkey FOREIGN KEY (supermarket_id) REFERENCES public.supermarkets(supermarket_id) ON DELETE CASCADE;
 S   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_supermarket_id_fkey;
       public          postgres    false    4751    222    220            �           2606    17782    payments fk_order    FK CONSTRAINT     �   ALTER TABLE ONLY public.payments
    ADD CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON DELETE CASCADE;
 ;   ALTER TABLE ONLY public.payments DROP CONSTRAINT fk_order;
       public          postgres    false    4759    226    230            �           2606    17777    payments fk_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.payments
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;
 :   ALTER TABLE ONLY public.payments DROP CONSTRAINT fk_user;
       public          postgres    false    230    218    4749            �           2606    17739 %   order_items order_items_order_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON DELETE CASCADE;
 O   ALTER TABLE ONLY public.order_items DROP CONSTRAINT order_items_order_id_fkey;
       public          postgres    false    226    4759    228            �           2606    17744 '   order_items order_items_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE;
 Q   ALTER TABLE ONLY public.order_items DROP CONSTRAINT order_items_product_id_fkey;
       public          postgres    false    4757    224    228            �           2606    17749 $   order_items order_items_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE SET NULL;
 N   ALTER TABLE ONLY public.order_items DROP CONSTRAINT order_items_user_id_fkey;
       public          postgres    false    228    4749    218            �           2606    17727    orders orders_household_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_household_id_fkey FOREIGN KEY (household_id) REFERENCES public.households(household_id) ON DELETE CASCADE;
 I   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_household_id_fkey;
       public          postgres    false    226    4745    216            �           2606    17722    orders orders_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE SET NULL;
 D   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_user_id_fkey;
       public          postgres    false    226    218    4749            �           2606    17763    payments payments_order_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON DELETE CASCADE;
 I   ALTER TABLE ONLY public.payments DROP CONSTRAINT payments_order_id_fkey;
       public          postgres    false    230    226    4759            �           2606    17768    payments payments_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE SET NULL;
 H   ALTER TABLE ONLY public.payments DROP CONSTRAINT payments_user_id_fkey;
       public          postgres    false    4749    218    230            �           2606    17674    users users_household_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_household_id_fkey FOREIGN KEY (household_id) REFERENCES public.households(household_id) ON DELETE CASCADE;
 G   ALTER TABLE ONLY public.users DROP CONSTRAINT users_household_id_fkey;
       public          postgres    false    218    4745    216            @   �   x�U��
�0��u�0�\g��Wn��R�
����[w��/x%�8��iy��5�ƴ��#����o�5,���������8��Ѝ!Ća*���cH	S҈�!�Ca�"
�{��Blơ2��;��p�a��68�-�0�g���!Ća*�	vc.;)�ҥs�      :   �   x�M�Kr�0  �59���d)�PR0P���Fhj0�����w��L|7o�V�㑣��w�냘j�
%�]wq�UښR<N��(�K���I8<��N�x���	¥��{y��a��f\�S�^,��J�4Y��f����C��#��S��Q� �y���z��l�;�`�ߤ-M�}���3���e�_�d��5|E�*55�KpX  �.C      F   �   x����� �� ccKt��?G��y(IU�x|��,����}d"T��;�v�+��;%+E�@
�;T��2�R=��9��%�8����WA��#\�)v��H�8��"��l��VI��x?�SF+;n��iִ�Y���D�H��uV���9���yAo�G�6p�)�7�$a�      D   7  x���IN1е�\�K�&�eq 6H��_����H�;�O�WY4i�����A@r���v��}M��eD} �z��+��ׄ�zK����'�����N�m��N��wQ�S��j�f�g�ȰG=~~|�o�7룊h�%���vX�zE��u���5��ٳ�ClJV�)��"zZ2����&��!�^3Vϗ�����+eo�e���K !�*��:��w�������Q��q
C�$�J-�!�j�E��4)�R�C����ϼ��P�ڕY��^]`�4بuM�4ֲ@�	�@��)OW>�G��z�a~ 3���      H   f  x���=�1�c�)�����Ǉ�/��� ���G����XN?UuW�!���ŌM�ۯ��|������,�/ěr�c�����F�S�k��S�(�=�B=�PߪH$�r�q"����;ј�;�l�q���Kx�G��s�W"��Df�K�lT�u�~�"�7H�EgIO����m�)�<Č����b(�,��g v���_oW+H}�:�sm��I
�
�M"��F�Ve�w�bHš����JȼIL������=ϖ[[sk�$�1y� ��,H1�!tK`My9����M���VR%Pr�l�`:2穕5�����0��b9����-ᅝ�1��ҼxR�ؖ��G�@�Һ���.�@ �mP�      B      x����r�E��_����=�3��Uq۱*rŕ�_���` �"}}�JH�}oYy��$w�`�=>�v�u_�iuy5��u�^?���W��l�.���WUxU�UiC�zw�X���o~e��t��������N�^}��Jj�� �:���m]����Ե6m��_���M��gmm���i�V�7��~�������n����< V�ﻝ�zܗ�(dmS����zz�b��8Y�V?��ak���4	Y��W�G9b�s=BV��n{9X;�ǹ9MB������{�G�`�t�F!kC]���啵z���$hk8m�?����t���j�w�+c>��i�v���~|~o���?���<� V���#�R��#8��@���~q��~m��d�>ލ���՛~����ݮ�������?v�u��=R����y����s!�T����^!�q3b��w�b���yA�X�gBe$��# ��r	]��������z���<(s
ws_����@B�ݰ�"�1��C�����f��@$N�f(Ġ���~���'p9�������~;[���`C4�1\��Χ�IS��]�u|�>��4�ގoS��8��[�v�Hh�ލ�.H���<"�ջ�}���sH�9N���i��aR��q�FB��������j�Ie�>���Wƫ�?���[~���������÷l�����^N3�3!��u�jX�F��l9\E=di0�a9?M��L�htzǘh�d7a`�c���%�l�wǫ�o���.��7!����{;��٢�~4;�����i ��V?���_̶�G� :��i��4ڟ�������OeĎa8Ϥ~&s�v>O#v��-��u���v��<�y���n��b��v��gA�C���r|��>X?-�����4�/ջn}��}�ܯM�����L�D�w������q5�x�#a�q�&��!�X���V���t���8����i������;.�l��)ܽ�ψ�C���x�-�[�?=xߎ_�?��׋i�5�]7\��������~{�pQ�;��x|�I��@gpKqQ�/�P}�1��8������%��W�P�NӠ�wW�����n߯םAA×��ܲ��f|U�>I��qh��%�#����+���X�п_=��l�G��4�ٌ�i��J�n�1��v�8>���v�_<����i��n D1~����t=��8����կ�;�n�,�t���R�c���g���y�' Ag�i7��A���[��r�I���4"՛���~1������C,n~��G��k w���?�ϓ!��s�����iX��d���y����#�r���?��ux|z���= �����<>I��Gs�8���<ٚ(
�ń2��1��k��f���4���h��m��r}�p����GP"|0�����ۈm��X>r��Q�L� ����ܐ�ܶ~��!��������w�ᎅ�՛�ٓ�.l�>���H�@������@@�bs;b?�o��x��|
���A<�l֣'0�m�v����ں���j{iRd�&���d��%�������'�Z�;a)�R�����Ra�0k9n���¬����YKa/,.��KQ1L	3�Z
�a92j��_���Yk�+���j�z�ΉT�����Bδf��԰\x5�B`հR�j�E��a%�԰��jX^�05�(��!�V"��a ��Ҹ�0�Q�J˩axK�$^��jXɬ��jX).5��԰0��0v�BX9ُ�P��C;,���� Rud�0��B�����b�n]�X~~C,�ɩ��0E,ԙu�L�uqHb-��P�E�Zb!V�8M,qyb������,R!Ҧ����b!4�*f��U�Z���s�X�%�YY,���L������@�bAj�/fA8|� ���s	cA�a��yc,�:�1WƂD�!Pk#H�Jc*�i}���YcA�G�Pm,H�1��Ƃ\3��X�6ǌ��948�1`9���38w,���A@�cA#m��=���1�ǂ�N,�/�MN������1�
� Z
B@*d!�>�f���O"�p��E�E���Y����p�6K����(D
%6N���!�eM2��1�BL�J�0P*Y��u��%�P2���BS;m2���Bp�,=[a,4Lc�܋�d��+c�vN(�3��FYh�Ҙ�U�BC��̭�S�6fo����1s+l���)��{��ٖH��{�o�![�W�ٛ������ du��c&�k��v�\��᱖/�aLy���c�k��H �I��H�f!q�1����@8f!��1��Br�0
�2Kd���-��&Ƞ��U��D�Xf�!�8X�,�2���2�!�(�,�:d�:d!;Cd ��2�l����,��H���e���IA[f�����e�]52��c�e:Gfb��Y�{d6i�*Hf�',������eV\I2��c�G���-�BF�L�2+�*�	��
�%Kϖ%��%��;,�����eV�2
���?��H�ZfR��d g�����@�2����Y�e&5�'�Ö��p��ډZfR;e�r�2��,�Y�e&5�(�h�Lj�Qf1���:R"���o�,�L�L�7SFᖙ�S�P���O�! -3	�R�BYf��2
��)��*CXH�L�+V����\�2��-�͕�4�Mb�W��0��,C(�L�.�!�e&�%ː��e&�m���e&BD�ҳE�D�j����D�l�����D�n����D�p����D�r����D�t����D�v����D�x���x�U�^f��/�ϗ![�/O#�e�f�B這�Yf�|��d`-3�l��D�,3���Yz���D>b�q��D�b1��D6c��|��cRP_q����~�e�Kf �%��M�A̷\�Zf�5�d�����a[f�~��e0�t��Zf�U��2�0p�L�e!0��4��Yz���4Ζ �̤a[f6e�I�h���e&-�23)X�LZ�ef"p������I�̤�[f&i�IK��l�2��j���q�LZ�efn�,3i]-3��a�I�h�� �e&-�23(�L��efB8,3ID�,=[�L��ef��-3I����[f��
��m���e�|-3��̒�e�P�Y�Zfg�%�ef-�-��̬��e�-3d9i�e�ef!��Y�[fo�e�ef1ЖY�[f n�eo�,�L�L��eF�Y�Zfl�eO�!`-��l��,�eV�-3
��Y<-3���̊�e���Z��e������e��p7��2CH(ˬ�-3����
�2C(ˬp-3d?l�i�m���e�5�2���2Ӛi��{q�Lk�efo�,3������̴�[f�Z�2Ӛh��[a�Lk�efo-3������̴fZf�^�mV�23��_��{�d����\@h�[f6 g�i�[f&k�i`[f&g�ip�����4�-3����4�-3����4�-3� ���j���e�µ�0�V�
�2� �L�m�A�e��j�a�e�B�� �2Sa[f�~ܪR�[fa���Zfi���-3��T����Xf���Y~�����e�8,3U�efsP����ef2Ж�*�23)X�L�m���e��j���L�n���e�J��l�2�H�����e��m���9�L��efR8,3�����Zfɖ��@Yf]-3�a�i$Zf��Zf-3k=o�it��P�2�H��PT�Іm���e���ebp��6����Xf�p-3��̴�[f�b�2�n�Y;Q����e�,�,3mȖ���Yf��-3���̴�[fk�iK��@�2���2�/�2���2��p�L[�e�P������B@Zf�:[f0e�i�l�Q8�����2CXH�L[W�'!���B��NޖN��$Nt�!a,3M|�a�,3Mt�a`,3M\�ُ[f��2�1H�,-��l-3ML���KXf�n���I�,1-3s;a�e�ef��-�L��̭�e�񖙽��2�23��YfZf�^�m6-3s/~���   {��d���L]@d�ef��Y�[f&m��ef"��Yq����̴�-3����
�2�ˬ�-3� ��S\-3����
�2��[��o�a �eVؖ�@Xf��2�(8�,�d���-�X�-3h?nUŚn�A�ek_�� -�X�-3��bͷ� �2���e�_�ekg��qXf�f[f6e����23h�,�efR��Yl��D�,�\-3��a��@��L�2��n���e�2���Yl����Yf1�Zf&��2���2�AX�,�ef"P�YW�̄pXfQ��Y~��YG��Z�[fQ-3�̢�-3�;��-3� �̢�Zf g�E��@�2�µ�,�2���̬Űen�Y;Q�,��e�,�,��d��B�,��|��"�-��t��b`-��t�D�-��ޖYy��YToˌ�-��T��@-����B@Zf1:[f0e���l�Q8���=-3����bt��p�^K����������2�i���1�-3����b�[fe��H���2��k�!�a�,6ޖ��Yf����o�LuJ      >   $  x����J�0�s���j�UE�ӲȂ'/�tچ�I�L���m�u�c/!��fn�a�w��4��Z���������6�� �OY�nr���1�F-��H�35`��wV�����g�3=]���"�N̏����iAFh��/H+��,�`;h��[���z���+
'�m��X,h�
��K�1huz&���b��V���ON�g1@�+��p�a�`ŧ4&��VZ�"�OR���P���ɒ�+�g�b���s-�<.
��5�\���$.�W�9�&E�      <     x�m��n�@ ��5<En�� �:U�a/E�Ɖ�*��M|�j7M��I>���^�}z�Z�a�C�w�Gȹŝ��08��R
�\H��B����߄[t�-�Tە����>��M�M�<rfuQ~+k��d1׵G9].f�^�Wv�cb�G���F���PF!ՔH�*�c��ve����{��˶����1���g�ii�WY[����/�<���3;���w3���P�M}-�A`~-���L��1�#�����H!0��0���w@U���c(     